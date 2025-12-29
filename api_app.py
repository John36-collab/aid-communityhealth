from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator
from typing import Literal
from ml.inference import predict_outcome
import httpx
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mental Health ML API")

# Security bearer for JWT token authentication
security = HTTPBearer()

# Supabase configuration - set these environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

class PatientInput(BaseModel):
    Age: int = Field(ge=0, le=120, description="Patient age in years")
    Gender: Literal["Male", "Female", "Other"]
    Diagnosis: Literal["Depression", "Anxiety", "Bipolar", "PTSD", "Schizophrenia", "Other"]
    Symptom_Severity: int = Field(ge=1, le=10, description="Symptom severity score 1-10")
    Mood_Score: int = Field(ge=1, le=10, description="Mood score 1-10")
    Sleep_Quality: int = Field(ge=1, le=10, description="Sleep quality score 1-10")
    Physical_Activity: int = Field(ge=0, le=168, description="Physical activity hours per week")
    Medication: Literal["SSRIs", "SNRIs", "Benzodiazepines", "Antipsychotics", "Mood Stabilizers", "None", "Other"]
    Therapy_Type: Literal["CBT", "DBT", "Psychodynamic", "Group Therapy", "Family Therapy", "None", "Other"]
    Treatment_Duration: int = Field(ge=0, le=520, description="Treatment duration in weeks")
    Stress_Level: int = Field(ge=1, le=10, description="Stress level 1-10")
    Treatment_Progress: int = Field(ge=1, le=10, description="Treatment progress score 1-10")
    Emotional_State: Literal["Stable", "Improving", "Declining", "Fluctuating", "Critical"]
    Adherence: int = Field(ge=0, le=100, description="Treatment adherence percentage 0-100")

    @field_validator('*', mode='before')
    @classmethod
    def strip_strings(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

async def verify_supabase_token(token: str) -> dict:
    """Verify JWT token with Supabase Auth"""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        logger.warning("Supabase configuration missing - authentication disabled")
        return {"sub": "anonymous", "authenticated": False}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": SUPABASE_ANON_KEY
                }
            )
            if response.status_code == 200:
                return response.json()
            else:
                return None
    except Exception as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Dependency to get and verify current user from JWT token"""
    token = credentials.credentials
    user = await verify_supabase_token(token)
    
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return user

@app.post("/predict")
async def predict(data: PatientInput, user: dict = Depends(get_current_user)):
    """
    Predict mental health treatment outcome for a patient.
    Requires valid JWT authentication token.
    """
    user_id = user.get("id", user.get("sub", "unknown"))
    logger.info(f"Prediction request from user: {user_id}")
    
    try:
        result = predict_outcome({
            "Age": data.Age,
            "Gender": data.Gender,
            "Diagnosis": data.Diagnosis,
            "Symptom Severity (1-10)": data.Symptom_Severity,
            "Mood Score (1-10)": data.Mood_Score,
            "Sleep Quality (1-10)": data.Sleep_Quality,
            "Physical Activity (hrs/week)": data.Physical_Activity,
            "Medication": data.Medication,
            "Therapy Type": data.Therapy_Type,
            "Treatment Duration (weeks)": data.Treatment_Duration,
            "Stress Level (1-10)": data.Stress_Level,
            "Treatment Progress (1-10)": data.Treatment_Progress,
            "AI-Detected Emotional State": data.Emotional_State,
            "Adherence to Treatment (%)": data.Adherence,
        })

        logger.info(f"Prediction completed for user: {user_id}")
        return result
    except Exception as e:
        logger.error(f"Prediction error for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.get("/health")
async def health_check():
    """Health check endpoint - no authentication required"""
    return {"status": "healthy"}
