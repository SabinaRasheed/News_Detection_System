from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import docx
from newspaper import Article

from utils import clean_text, count_words, find_suspicious_words, generate_explanation

model = joblib.load('model/fake_news_model.pkl')
vectorizer = joblib.load('model/vectorizer.pkl')

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Fake News Detection API is running.'

@app.route('/predict-text', methods=['POST'])
def predict_from_text():
    data = request.json
    raw_text = data.get('text', '')
    return run_prediction(raw_text)

@app.route('/predict-url', methods=['POST'])
def predict_from_url():
    data = request.json
    url = data.get('url', '')
    try:
        article = Article(url)
        article.download()
        article.parse()
        full_text = article.title + ' ' + article.text
        return run_prediction(full_text)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict-file', methods=['POST'])
def predict_from_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    ext = file.filename.split('.')[-1]

    if ext == 'txt':
        text = file.read().decode('utf-8')
    elif ext == 'docx':
        doc = docx.Document(file)
        text = ' '.join([para.text for para in doc.paragraphs])
    else:
        return jsonify({'error': 'Unsupported file format'}), 400

    return run_prediction(text)

def run_prediction(raw_text):
    cleaned = clean_text(raw_text)
    vec = vectorizer.transform([cleaned])
    real_proba = model.predict_proba(vec)[0][1]

    # Try using a lower threshold to increase flexibility
    if real_proba >= 0.55:
        label = 'Real'
    else:
        label = 'Fake'

    suspicious_words = find_suspicious_words(raw_text)
    word_count = count_words(cleaned)
    explanation = generate_explanation(label, suspicious_words)

    response = {
        'text': raw_text,
        'cleaned': cleaned,
        'label': label,
        'confidence': round(float(real_proba), 2),
        'word_count': word_count,
        'suspicious_words': suspicious_words,
        'explanation': explanation
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
