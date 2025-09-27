def generate_report(caption, risk_tags, keywords, translation, eo_analysis=None):
    """
    Generate a combined report dictionary.
    eo_analysis is optional.
    """
    report = {
        "caption": caption,
        "risk_tags": risk_tags,
        "keywords": keywords,
        
    }
    if eo_analysis:
        report["eo_analysis"] = eo_analysis
    return report
