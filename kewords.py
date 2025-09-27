# utils/keywords.py

def extract_keywords(text, top_n=3):
    """Return first `top_n` words as dummy keywords."""
    words = text.split()
    return words[:top_n]
