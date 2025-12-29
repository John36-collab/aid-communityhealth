from fastapi import FastAPI
from pydantic import BaseModel
from ml.inference import predict_outcome

app = FastAPI(title="Mental Health ML API")

class PatientInput(BaseModel):
    Age: int
    Gender: str
    Diagnosis: str
    Symptom_Severity: int
    Mood_Score: int
    Sleep_Quality: int
    Physical_Activity: int
    Medication: str
    Therapy_Type: str
    Treatment_Duration: int
    Stress_Level: int
    Treatment_Progress: int
    Emotional_State: str
    Adherence: int

@app.post("/predict")
def predict(data: PatientInput):
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

    return result
