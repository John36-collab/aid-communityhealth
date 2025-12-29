import pickle
import pandas as pd

model = pickle.load(open("ml/model.pkl", "rb"))
encoders = pickle.load(open("ml/encoders.pkl", "rb"))

def predict_outcome(input_data: dict):
    df = pd.DataFrame([input_data])

    for col, encoder in encoders.items():
        if col in df.columns:
            df[col] = encoder.transform(df[col])

    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]

    outcome_label = encoders["Outcome"].inverse_transform([prediction])[0]
    confidence = round(max(probabilities) * 100, 2)

    return {
        "predicted_outcome": outcome_label,
        "confidence": confidence
    }
