import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier

print("Training models...")

os.makedirs("models", exist_ok=True)

np.random.seed(42)
n = 1000

duration = np.random.randint(10, 120, n).astype(float)
time_of_day = np.random.randint(0, 4, n).astype(float)
sessions_per_day = np.random.randint(0, 6, n).astype(float)
break_time = np.random.randint(0, 45, n).astype(float)

productivity_score = (
    0.4 * duration +
    0.1 * (3 - time_of_day) * 10 +
    0.2 * sessions_per_day * 5 +
    0.1 * break_time +
    np.random.normal(0, 5, n)
)
productivity_score = np.clip(productivity_score, 30, 100)

def label_focus(score):
    if score >= 80:
        return 2
    elif score >= 50:
        return 1
    else:
        return 0

focus_level = np.array([label_focus(s) for s in productivity_score])

X = np.column_stack([duration, time_of_day, sessions_per_day, break_time])

X_train, X_test, y_train, y_test = train_test_split(X, productivity_score, test_size=0.2, random_state=42)
_, _, y_train_f, _ = train_test_split(X, focus_level, test_size=0.2, random_state=42)

scaler = MinMaxScaler()
X_train_s = scaler.fit_transform(X_train)

model = LinearRegression()
model.fit(X_train_s, y_train)

rf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
rf.fit(X_train_s, y_train_f)

joblib.dump(model, "models/productivity_model.pkl")
joblib.dump(rf, "models/focus_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")

print("Done! Models saved:")
print("  models/productivity_model.pkl")
print("  models/focus_model.pkl")
print("  models/scaler.pkl")
