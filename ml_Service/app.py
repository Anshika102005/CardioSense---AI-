from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load trained model files
try:
    model = joblib.load(os.path.join(script_dir, "heart_pipeline.pkl"))
    scaler = joblib.load(os.path.join(script_dir, "scaler.pkl"))
    feature_columns = joblib.load(os.path.join(script_dir, "feature_columns.pkl"))
    print("ML model files loaded successfully!")
    print(f"Feature columns: {feature_columns}")
except Exception as e:
    print(f"Error loading model files: {e}")
    model = None
    scaler = None
    feature_columns = None

# Encoding mappings to convert frontend string values to numeric values
gender_encoding = {"Female": 0, "Male": 1}
chest_pain_encoding = {
    "Typical Angina": 0,
    "Atypical Angina": 1,
    "Non-Anginal Pain": 2,
    "Asymptomatic": 3
}
fasting_bs_encoding = {"No": 0, "Yes": 1}
resting_ecg_encoding = {
    "Normal": 0,
    "ST-T Wave Abnormality": 1,
    "Left Ventricular Hypertrophy": 2
}
exercise_angina_encoding = {"No": 0, "Yes": 1}
st_slope_encoding = {
    "Upsloping": 0,
    "Flat": 1,
    "Downsloping": 2
}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify({"error": "ML model not loaded"}), 500

        data = request.json
        print(f"Received data: {data}")

        # Initialize all feature columns to 0
        input_features = {col: 0 for col in feature_columns}

        # Set numeric features
        input_features['Age'] = data.get("age")
        input_features['RestingBP'] = data.get("restingBP")
        input_features['Cholesterol'] = data.get("cholesterol")
        input_features['MaxHR'] = data.get("maxHeartRate")
        input_features['Oldpeak'] = data.get("oldpeak")

        # Set binary features
        input_features['FastingBS'] = 1 if data.get("fastingBS") == "Yes" else 0
        input_features['Sex_M'] = 1 if data.get("gender") == "Male" else 0
        input_features['ExerciseAngina_Y'] = 1 if data.get("exerciseAngina") == "Yes" else 0

        # Set one-hot encoded categorical features
        chest_pain_type = data.get("chestPainType")
        if chest_pain_type == "Atypical Angina":
            input_features['ChestPainType_ATA'] = 1
        elif chest_pain_type == "Non-Anginal Pain":
            input_features['ChestPainType_NAP'] = 1
        elif chest_pain_type == "Typical Angina":
            input_features['ChestPainType_TA'] = 1
        # Asymptomatic is the base case, all 0

        resting_ecg = data.get("restingECG")
        if resting_ecg == "Normal":
            input_features['RestingECG_Normal'] = 1
        elif resting_ecg == "ST-T Wave Abnormality":
            input_features['RestingECG_ST'] = 1
        # Left Ventricular Hypertrophy is the base case, all 0

        st_slope = data.get("stSlope")
        if st_slope == "Flat":
            input_features['ST_Slope_Flat'] = 1
        elif st_slope == "Upsloping":
            input_features['ST_Slope_Up'] = 1
        # Downsloping is the base case, all 0

        print(f"Input features: {input_features}")

        # Convert to DataFrame
        input_df = pd.DataFrame([input_features])

        # Ensure correct column order
        input_df = input_df[feature_columns]

        print(f"Input DataFrame columns: {input_df.columns.tolist()}")
        print(f"Input DataFrame: {input_df}")

        # Scale input
        input_scaled = scaler.transform(input_df)

        # Prediction
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1]

        print(f"Prediction: {prediction}, Probability: {probability}")

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        import traceback
        print(f"Error during prediction: {e}")
        print(traceback.format_exc())
        return jsonify({"error": str(e), "trace": traceback.format_exc()})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000, host='0.0.0.0')
    #app.run(debug=True, port=8000)
