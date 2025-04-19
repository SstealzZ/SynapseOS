from fastapi import APIRouter, HTTPException, Body, Query, Depends
from typing import List, Optional
from datetime import datetime, timedelta

from db import get_ai_outputs_collection
from models import AIOutput, AIOutputCreate

router = APIRouter()


@router.get("/{name}", response_model=List[AIOutput])
async def get_user_ai_outputs(
    name: str,
    limit: int = 10,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    collection = Depends(get_ai_outputs_collection)
):
    """
    Retrieve AI-generated outputs for a specific user with optional date filtering
    
    Args:
        name: User's name
        limit: Maximum number of entries to return
        start_date: Optional start date (YYYY/MM/DD format)
        end_date: Optional end date (YYYY/MM/DD format)
        collection: MongoDB collection dependency
        
    Returns:
        List[AIOutput]: List of AI output entries
    """
    query = {"Name": name}
    
    # Apply date filters if provided
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = start_date
        if end_date:
            date_query["$lte"] = end_date
        if date_query:
            query["Date"] = date_query
    
    # Execute query and return results
    ai_outputs = []
    async for output in collection.find(query).sort("Date", -1).limit(limit):
        ai_outputs.append(output)
    
    return ai_outputs


@router.post("/", response_model=AIOutput)
async def create_ai_output(
    ai_output: AIOutputCreate = Body(...),
    collection = Depends(get_ai_outputs_collection)
):
    """
    Create a new AI-generated output entry
    
    Args:
        ai_output: AI output data to create
        collection: MongoDB collection dependency
        
    Returns:
        AIOutput: Created AI output entry
    """
    # Insert new AI output
    new_output = ai_output.dict(by_alias=True)
    result = await collection.insert_one(new_output)
    
    # Return created AI output with _id
    created_output = await collection.find_one({"_id": result.inserted_id})
    return created_output


@router.get("/latest/{name}", response_model=AIOutput)
async def get_latest_ai_output(
    name: str,
    collection = Depends(get_ai_outputs_collection)
):
    """
    Get the latest AI-generated output for a user
    
    Args:
        name: User's name
        collection: MongoDB collection dependency
        
    Returns:
        AIOutput: Latest AI output entry
    """
    # Find the latest entry
    latest = await collection.find_one(
        {"Name": name},
        sort=[("Date", -1)]
    )
    
    if not latest:
        raise HTTPException(
            status_code=404,
            detail=f"No AI output entries found for user {name}"
        )
    
    return latest 