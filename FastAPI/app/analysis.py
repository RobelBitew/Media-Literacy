from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis")

def analyze_sentiment(text: str) -> str:
    if not text.strip():
        return "NEUTRAL"

    try:
        result = sentiment_pipeline(text[:512])[0]  
        return result["label"]
    except Exception as e:
        print(f"Sentiment analysis failed: {e}")
        return "ERROR"
