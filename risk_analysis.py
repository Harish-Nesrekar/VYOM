def detect_risk(text: str):
    # Dummy risk analysis
    risks = ["high_risk"] if "danger" in text.lower() else ["low_risk"]
    return risks
