---

AI Health Assistance Community

Project Overview

AI Health Assistance Community is a web-based platform designed to provide mental health support and prediction using AI and Machine Learning. The system combines:

Lovable-powered frontend: Chatbot for user interaction, mental health guidance, and support.

Machine Learning backend: Predicts mental health outcomes using historical datasets.

Community insights: Users can contribute, track progress, and follow treatment plans.


This project aims to bridge the gap between mental health awareness and actionable insights through AI, data analytics, and accessible web interfaces.


---

Features

Interactive AI Chatbot: Provides mental health guidance and responds to queries.

Predictive Analytics: Uses supervised ML models to predict mental health outcomes.

Data-Driven Insights: Monitors patient progress, adherence, stress levels, and therapy outcomes.

Community Dashboard: Users can track their treatment progress and mood scores.

Cross-Platform Access: Deployed via Lovable for web and mobile support.



---

Dataset

The ML system is trained on a mental health dataset containing:

Patient demographics (Age, Gender)

Diagnosis and symptom severity

Mood, sleep quality, physical activity

Medication and therapy type

Treatment duration and progress

AI-detected emotional states and adherence


The dataset is stored as mental_health_data.csv and used for training and inference.


---

Machine Learning System

Training: mltrain_model.py trains supervised ML models (e.g., Random Forest, XGBoost) using the mental health dataset.

Inference: mlinference.py predicts outcomes for new patient data.

Pickle Files:

model.pkl — trained ML model

encoder.pkl — label encoder for categorical features




---

Frontend Integration

API Endpoints: api_app.py provides endpoints for ML predictions.

Frontend Call: frontend_predict.js fetches prediction results from the backend API.

Live Interaction: Users can enter their details and receive predictions in real-time.



---

Deployment

Lovable Deployment: The chatbot and ML backend are deployed using Lovable for instant web access.

GitHub Repository: Stores the full codebase, dataset, API endpoints, and ML models.

Termux Support: Compatible with Termux for mobile development and deployment.



---

Installation & Usage

1. Clone the repository



git clone https://github.com/John36-collab/aid-communityhealth.git
cd aid-communityhealth

2. Install dependencies



pip install -r requirements.txt

3. Run ML API server



python api_app.py

4. Interact via frontend



Open the Lovable interface or web dashboard

Enter patient details and receive mental health predictions



---

File Structure

aid-communityhealth/
├─ mental_health_data.csv
├─ mltrain_model.py
├─ mlinference.py
├─ model.pkl
├─ encoder.pkl
├─ frontend_predict.js
├─ api_app.py
├─ requirements.txt
└─ README.md


---

Live Links & Resources

Lovable Project Link: [https://aid-communityhealth.lovable.app]

Pitch Deck: [https://www.canva.com/design/DAG19fdmnrA/fBMbnM0tAv91S-GcjX6d4g/view?utm_content=DAG19fdmnrA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h448b52c564]

GitHub Repository: https://github.com/John36-collab/aid-communityhealth



---

Contributing

We welcome contributions! You can:

Report issues or bugs

Suggest features

Submit pull requests for enhancements



---

License

This project is released under the MIT License.


---


