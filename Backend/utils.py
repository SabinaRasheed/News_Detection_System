import string
import nltk
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('wordnet')

STOPWORDS = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

SUSPICIOUS_WORDS = [
    'shocking', 'exposed', 'secret', 'truth', 'you won’t believe', 'disaster',
    'busted', 'revealed', 'scandal', 'viral', 'unbelievable', 'alert', 'urgent',
    'miracle', 'hidden truth', 'top secret', 'breaking news', 'exclusive',
    'uncovered','cover-up', 'what happened next', 'insane',
    'devastating', 'watch now', 'don’t miss this', 'confirmed', 'dramatic',
    'unprecedented', 'mind-blowing', 'crazy', 'incredible', 'unseen',
    'never before', 'never seen', 'never heard', 'never imagined',
    'official', 'massive', 'hoax', 'censored', 'anonymous sources',
    'media blackout', 'leaked', 'explosive', 'jaw-dropping', 'game changer',
    'must see', 'click here', 'get the facts', 'mainstream media won’t show',
    'trending', 'crisis', 'fury', 'outrage', 'disturbing', 'tragedy',
    'no one talks about', 'destroyed', 'corrupt', 'brainwashing',
    'indoctrination', 'hidden agenda', 'conspiracy', 'fake news',
    'scam', 'fraud', 'whistleblower', 'exposé', 'conspiracy theory',
    'deception', 'manipulation', 'misleading', 'false narrative'
]

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z]", " ", text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = text.split()
    words = [lemmatizer.lemmatize(w) for w in words if w not in STOPWORDS and len(w) > 2]
    return ' '.join(words)

def count_words(text):
    return len(text.split())

def find_suspicious_words(text):
    found = []
    text_lower = text.lower()
    for word in SUSPICIOUS_WORDS:
        if word in text_lower:
            found.append(word)
    return found

def generate_explanation(label, suspicious_words):
    if label == 'Fake':
        if suspicious_words:
            return f"Detected sensational terms."
        else:
            return "Text flagged as fake but no strong suspicious words detected."
    else:
        return "Text appears legitimate based on language used."
