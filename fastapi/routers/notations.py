from fastapi import APIRouter, HTTPException, Body, Query, Depends
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId

from db import get_notations_collection
from models import Notation, NotationCreate

router = APIRouter()


@router.get("/{name}", response_model=List[Notation])
async def get_user_notations(
    name: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    collection = Depends(get_notations_collection)
):
    """
    Retrieve notations for a specific user with optional date filtering
    
    Args:
        name: User's name
        start_date: Optional start date (YYYY/MM/DD format)
        end_date: Optional end date (YYYY/MM/DD format)
        collection: MongoDB collection dependency
        
    Returns:
        List[Notation]: List of notation entries
    """
    query = {"name": name}
    
    # Apply date filters if provided
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = start_date
        if end_date:
            date_query["$lte"] = end_date
        if date_query:
            query["date"] = date_query
    
    print(f"Executing notation query: {query}")
    
    # Execute query and return results
    notations = []
    async for notation in collection.find(query).sort("date", -1):
        print(f"Found notation: {notation}")
        notations.append(notation)
    
    return notations


@router.post("/", response_model=Notation)
async def create_notation(
    notation: NotationCreate = Body(...),
    collection = Depends(get_notations_collection)
):
    """
    Create a new notation entry
    
    Args:
        notation: Notation data to create
        collection: MongoDB collection dependency
        
    Returns:
        Notation: Created notation entry
    """
    # Check if a notation for this user and date already exists
    existing = await collection.find_one({
        "name": notation.name,
        "date": notation.date
    })
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Notation for user {notation.name} on date {notation.date} already exists"
        )
    
    # Insert new notation
    new_notation = notation.dict(by_alias=True)
    result = await collection.insert_one(new_notation)
    
    # Return created notation with _id
    created_notation = await collection.find_one({"_id": result.inserted_id})
    return created_notation


@router.get("/stats/{name}")
async def get_notation_stats(
    name: str,
    days: int = 30,
    collection = Depends(get_notations_collection)
):
    """
    Get statistical information about user's notations
    
    Args:
        name: User's name
        days: Number of days to analyze
        collection: MongoDB collection dependency
        
    Returns:
        dict: Statistical information including averages and trends
    """
    # Calculate date range
    today = datetime.now()
    start_date = (today - timedelta(days=days)).strftime("%Y/%m/%d")
    
    # Get notations for the given period
    query = {
        "name": name,
        "date": {"$gte": start_date}
    }
    
    # Execute query and calculate statistics
    notations = []
    async for notation in collection.find(query).sort("date", 1):
        notations.append(notation)
    
    if not notations:
        return {
            "message": f"No notations found for user {name} in the last {days} days",
            "stats": {}
        }
    
    # Calculate averages for each category
    categories = [
        "spiritual_note", "physical_note", "mental_note", 
        "business_note", "social_note", "three_things_note", "russian_note"
    ]
    
    stats = {}
    for category in categories:
        category_key = "3_things_note" if category == "three_things_note" else category
        values = [notation.get(category_key, 0) for notation in notations]
        if values:
            stats[category] = {
                "average": sum(values) / len(values),
                "min": min(values),
                "max": max(values),
                "trend": calculate_trend(values)
            }
    
    return {
        "total_entries": len(notations),
        "date_range": {
            "start": start_date,
            "end": today.strftime("%Y/%m/%d")
        },
        "stats": stats
    }


def calculate_trend(values, window=7):
    """
    Calculate trend direction based on recent values
    
    Args:
        values: List of numeric values
        window: Window size for trend calculation
        
    Returns:
        str: Trend direction (up, down, stable)
    """
    if len(values) < window:
        return "insufficient_data"
    
    recent = values[-window:]
    older = values[-2*window:-window] if len(values) >= 2*window else values[:window]
    
    recent_avg = sum(recent) / len(recent)
    older_avg = sum(older) / len(older)
    
    diff = recent_avg - older_avg
    if abs(diff) < 0.5:
        return "stable"
    elif diff > 0:
        return "up"
    else:
        return "down" 