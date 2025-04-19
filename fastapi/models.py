from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    """
    Custom ObjectId class that provides validation and serialization for MongoDB ObjectId
    """
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class NotationBase(BaseModel):
    """
    Base model for daily notation entries
    
    Attributes:
        name: User's name
        date: Date of notation in YYYY/MM/DD format
        spiritual_note: Score for spiritual well-being (0-10)
        physical_note: Score for physical well-being (0-10)
        mental_note: Score for mental well-being (0-10)
        business_note: Score for business/work well-being (0-10)
        social_note: Score for social well-being (0-10)
        three_things_note: Score for "3 things" category (0-10)
        russian_note: Score for Russian language practice (0-10)
    """
    name: str
    date: str
    spiritual_note: int = Field(..., ge=0, le=10)
    physical_note: int = Field(..., ge=0, le=10)
    mental_note: int = Field(..., ge=0, le=10)
    business_note: int = Field(..., ge=0, le=10)
    social_note: int = Field(..., ge=0, le=10)
    three_things_note: int = Field(..., ge=0, le=10, alias="3_things_note")
    russian_note: int = Field(..., ge=0, le=10)


class NotationCreate(NotationBase):
    """
    Model for creating a new notation entry
    """
    pass


class Notation(NotationBase):
    """
    Complete notation model including database ID
    
    Attributes:
        id: MongoDB ObjectId
    """
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class InputBase(BaseModel):
    """
    Base model for raw user input from Telegram
    
    Attributes:
        Name: User's name
        Date: Date of input
        Spiritual_meaning: Description of spiritual state
        Physical_meaning: Description of physical state
        Mental_meaning: Description of mental state
        Business_meaning: Description of business/work state
        Social_meaning: Description of social state
        3_things: Three important things for the day
        Russian_lesson: Description of Russian language practice
    """
    Name: str
    Date: str
    Spiritual_meaning: str
    Physical_meaning: str
    Mental_meaning: str
    Business_meaning: str
    Social_meaning: str
    three_things: str = Field(..., alias="3_things")
    Russian_lesson: str


class InputCreate(InputBase):
    """
    Model for creating a new input entry
    """
    pass


class Input(InputBase):
    """
    Complete input model including database ID
    
    Attributes:
        id: MongoDB ObjectId
    """
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class AIOutputBase(BaseModel):
    """
    Base model for AI-generated outputs
    
    Attributes:
        Name: User's name
        Date: Date of AI output
        output: AI-generated content/advice
    """
    Name: str
    Date: str
    output: str


class AIOutputCreate(AIOutputBase):
    """
    Model for creating a new AI output entry
    """
    pass


class AIOutput(AIOutputBase):
    """
    Complete AI output model including database ID
    
    Attributes:
        id: MongoDB ObjectId
    """
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str} 