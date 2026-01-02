import { supabase } from '@/integrations/supabase/client';

export async function predictMentalHealth(formData) {
  try {
    // Get current session token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to make predictions');
    }

    const response = await fetch(
      "https://YOUR-BACKEND-URL/predict",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          Age: formData.age,
          Gender: formData.gender,
          Diagnosis: formData.diagnosis,
          Symptom_Severity: Number(formData.symptomSeverity),
          Mood_Score: Number(formData.moodScore),
          Sleep_Quality: Number(formData.sleepQuality),
          Physical_Activity: Number(formData.physicalActivity),
          Medication: formData.medication,
          Therapy_Type: formData.therapyType,
          Treatment_Duration: Number(formData.treatmentDuration),
          Stress_Level: Number(formData.stressLevel),
          Treatment_Progress: Number(formData.progress),
          Emotional_State: formData.emotionalState,
          Adherence: Number(formData.adherence)
        })
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error('Prediction request failed');
    }

    const data = await response.json();

    return {
      outcome: data.predicted_outcome,
      confidence: data.confidence
    };

  } catch (error) {
    console.error("Prediction Error:", error.message);
    return {
      outcome: "Error",
      confidence: 0,
      error: error.message
    };
  }
}
