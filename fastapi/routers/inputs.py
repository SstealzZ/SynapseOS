from fastapi import APIRouter, HTTPException, Body, Query, Depends
from typing import List, Optional
from datetime import datetime, timedelta

from db import get_inputs_collection
from models import Input, InputCreate

router = APIRouter()


@router.get("/{name}", response_model=List[Input])
async def get_user_inputs(
    name: str,
    limit: int = 50,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    collection = Depends(get_inputs_collection)
):
    """
    Retrieve raw input entries for a specific user with optional date filtering
    
    Args:
        name: User's name
        limit: Maximum number of entries to return
        start_date: Optional start date (YYYY/MM/DD format)
        end_date: Optional end date (YYYY/MM/DD format)
        collection: MongoDB collection dependency
        
    Returns:
        List[Input]: List of input entries
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
    inputs = []
    async for input_entry in collection.find(query).sort("Date", -1).limit(limit):
        inputs.append(input_entry)
    
    return inputs


@router.post("/", response_model=Input)
async def create_input(
    input_entry: InputCreate = Body(...),
    collection = Depends(get_inputs_collection)
):
    """
    Create a new raw input entry
    
    Args:
        input_entry: Input data to create
        collection: MongoDB collection dependency
        
    Returns:
        Input: Created input entry
    """
    # Insert new input
    new_input = input_entry.dict(by_alias=True)
    result = await collection.insert_one(new_input)
    
    # Return created input with _id
    created_input = await collection.find_one({"_id": result.inserted_id})
    return created_input


@router.get("/latest/{name}", response_model=Input)
async def get_latest_input(
    name: str,
    collection = Depends(get_inputs_collection)
):
    """
    Get the latest input entry for a user
    
    Args:
        name: User's name
        collection: MongoDB collection dependency
        
    Returns:
        Input: Latest input entry
    """
    # Find the latest entry
    latest = await collection.find_one(
        {"Name": name},
        sort=[("Date", -1)]
    )
    
    if not latest:
        raise HTTPException(
            status_code=404,
            detail=f"No input entries found for user {name}"
        )
    
    return latest 