import pandas as pd
import numpy as np
import joblib
import nltk
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix, roc_auc_score

nltk.download('stopwords')
nltk.download('wordnet')

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

STOPWORDS = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

df_fake = pd.read_csv('Dataset/Fake.csv')
df_real = pd.read_csv('Dataset/True.csv')

df_fake['label'] = 0  # Fake
df_real['label'] = 1  # Real

min_len = min(len(df_fake), len(df_real))
df_fake = df_fake.sample(min_len, random_state=42)
df_real = df_real.sample(min_len, random_state=42)

df_balanced = pd.concat([df_fake, df_real]).sample(frac=1, random_state=42).reset_index(drop=True)

df_balanced['content'] = df_balanced['title'].astype(str) + ' ' + df_balanced['text'].astype(str)

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)  
    text = re.sub(r"[^\w\s]", "", text)  
    words = text.split()
    words = [lemmatizer.lemmatize(w) for w in words if w not in STOPWORDS or w in ['no', 'not', 'very']]
    return ' '.join(words)

df_balanced['cleaned'] = df_balanced['content'].apply(clean_text)

X = df_balanced['cleaned']
y = df_balanced['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

vectorizer = TfidfVectorizer(max_features=7000, ngram_range=(1, 2), stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = MultinomialNB()
model.fit(X_train_vec, y_train)

y_pred = model.predict(X_test_vec)
y_proba = model.predict_proba(X_test_vec)[:, 1]

print("\n=== Classification Report ===")
print(classification_report(y_test, y_pred))

conf_matrix = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix:\n", conf_matrix)
print("Accuracy:", round(accuracy_score(y_test, y_pred), 3))
print("ROC AUC Score:", round(roc_auc_score(y_test, y_proba), 3))

joblib.dump(model, 'model/fake_news_model.pkl')
joblib.dump(vectorizer, 'model/vectorizer.pkl')

feature_names = np.array(vectorizer.get_feature_names_out())
log_probs = model.feature_log_prob_[0]  
top_indices = np.argsort(log_probs)[-30:]
suspicious_words = {feature_names[i]: log_probs[i] for i in top_indices}

joblib.dump(suspicious_words, 'model/suspicious_words.pkl')

print("\nTop Suspicious (Fake) Words:")
for word, weight in list(suspicious_words.items())[-10:]:
    print(f"{word}: {round(weight, 3)}")

print("\nModel, vectorizer, and suspicious keywords saved successfully.")
