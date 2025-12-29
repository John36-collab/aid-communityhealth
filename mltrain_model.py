import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

# Load data
df = pd.read_csv("data/mental_health_data.csv")

# Drop missing values
df = df.dropna()

# Encode categorical columns
encoders = {}
categorical_cols = [
    "Gender", "Diagnosis", "Medication",
    "Therapy Type", "AI-Detected Emotional State"
]

for col in categorical_cols + ["Outcome"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features & target
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    random_state=42
)
model.fit(X_train, y_train)

# Save model & encoders
pickle.dump(model, open("ml/model.pkl", "wb"))
pickle.dump(encoders, open("ml/encoders.pkl", "wb"))

print("✅ Model trained and saved successfully")
