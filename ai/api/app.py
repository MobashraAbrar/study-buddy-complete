from flask import Flask, request, jsonify
import numpy as np
import joblib

app = Flask(__name__)

model = joblib.load("../models/productivity_model.pkl")
rf = joblib.load("../models/focus_model.pkl")
scaler = joblib.load("../models/scaler.pkl")

@app.route('/predict', methods=['POST'])
def predict():

    data = request.json

    features = np.array([[
        float(data['duration']),
        int(data['time_of_day']),
        float(data['sessions_per_day']),
        float(data['break_time'])
    ]])

    features = scaler.transform(features)

    productivity = model.predict(features)[0]
    focus = rf.predict(features)[0]

    return jsonify({
        "productivity_score": round(float(productivity), 2),
        "focus_level": int(focus)
    })

if __name__ == "__main__":
    app.run(debug=True)