from fastapi import FastAPI
import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

app = FastAPI()

# Connect to PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost/dbname"
engine = create_engine(DATABASE_URL)

MODEL_PATH = "recipe_recommendation_model.pkl"

@app.post("/train-model")
def train_model():
    # Load user selection data
    query = "SELECT user_id, recipe_id, meal_type FROM user_recipe_selections"
    df = pd.read_sql(query, engine)

    if len(df) < 100:
        return {"message": "Not enough data to train the model"}

    # Feature Engineering
    X = df[['user_id', 'meal_type']]
    y = df['recipe_id']  # Target: Recipe to recommend

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a simple ML model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save Model
    joblib.dump(model, MODEL_PATH)
    return {"message": "Model trained successfully"}

@app.get("/recommend-recipes/{user_id}")
def recommend_recipes(user_id: int, meal_type: str):
    try:
        model = joblib.load(MODEL_PATH)
        prediction = model.predict([[user_id, meal_type]])
        return {"recommended_recipe_id": int(prediction[0])}
    except:
        return {"error": "Model not trained yet"}
