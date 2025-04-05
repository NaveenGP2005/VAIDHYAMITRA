import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load the CSV file
csv_path = "../data/train.csv"  # Path to dataset
df = pd.read_csv(csv_path)

# Extract questions and answers
questions = df["Question"].astype(str)
answers = df["Answer"].astype(str)

# Convert text into numerical features using TF-IDF
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(questions)

# Train a simple model (Logistic Regression)
model = LogisticRegression()
model.fit(X, answers)

# Save the model and vectorizer
with open("models/healthcare_bot.pkl", "wb") as f:
    pickle.dump((vectorizer, model), f)

print("✅ Model trained and saved successfully in backend/models/!")
