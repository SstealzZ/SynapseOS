import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends
import os
from typing import Any, Dict, Optional
from dotenv import load_dotenv
import pathlib

# Load environment variables from .env file
env_path = pathlib.Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# MongoDB connection settings from environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://192.168.1.177:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "SynapseOS")

print(f"Connecting to MongoDB at: {MONGO_URI}")

# Collection names
NOTATIONS_COLLECTION = "SynapseOS-notation"
INPUTS_COLLECTION = "SynapseOS"
AI_OUTPUTS_COLLECTION = "SynapseOS-output"

client: Optional[AsyncIOMotorClient] = None


async def get_client() -> AsyncIOMotorClient:
    """
    Create and return a singleton MongoDB client
    
    Returns:
        AsyncIOMotorClient: MongoDB client instance
    """
    global client
    if client is None:
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    return client


async def get_database():
    """
    Get the MongoDB database
    
    Returns:
        AsyncIOMotorDatabase: Database instance
    """
    client = await get_client()
    return client[DATABASE_NAME]


async def get_notations_collection():
    """
    Get the notations collection
    
    Returns:
        AsyncIOMotorCollection: Collection for notations
    """
    db = await get_database()
    return db[NOTATIONS_COLLECTION]


async def get_inputs_collection():
    """
    Get the raw inputs collection
    
    Returns:
        AsyncIOMotorCollection: Collection for raw inputs
    """
    db = await get_database()
    return db[INPUTS_COLLECTION]


async def get_ai_outputs_collection():
    """
    Get the AI outputs collection
    
    Returns:
        AsyncIOMotorCollection: Collection for AI outputs
    """
    db = await get_database()
    return db[AI_OUTPUTS_COLLECTION]


async def close_mongo_connection():
    """
    Close the MongoDB connection when the application shuts down
    """
    global client
    if client is not None:
        client.close()
        client = None 