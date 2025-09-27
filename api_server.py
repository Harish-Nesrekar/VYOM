# main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil, os

from inference.caption import get_caption
from inference.vqa import get_vqa_answer
from inference.eo_analysis import get_eo_analysis
from utils.kewords import extract_keywords
from utils.translate import translate_text

app = FastAPI(title="Multimodal GPT-OSS + EO AI")

# === Enable CORS for frontend ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Upload folder ===
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# === Risk scoring function ===
def calculate_risk(caption: str, eo_class: str = None, eo_conf: float = 0.0):
    caption_lower = caption.lower()
    risk = "Low"

    high_risk_keywords = ["flood", "fire", "smoke", "cyclone", "earthquake"]
    medium_risk_keywords = ["deforestation", "urbanization", "pollution"]

    if any(k in caption_lower for k in high_risk_keywords):
        risk = "High"
    elif any(k in caption_lower for k in medium_risk_keywords):
        risk = "Medium"

    # Boost risk if EO analysis confidence is high
    if eo_class and eo_class.lower() in ["flood", "wildfire"] and eo_conf > 0.7:
        risk = "High"

    return risk

# === Helper: generate human-readable report ===
def format_readable_report(result: dict, question: str = None) -> str:
    caption = result.get("caption", "")
    answer = result.get("answer", "")
    keywords = ", ".join(result.get("keywords", []))
    eo_analysis = result.get("eo_analysis", {})
    translation = result.get("translation", "")

    eo_class = eo_analysis.get("class", "Unknown")
    eo_conf = eo_analysis.get("confidence", 0)

    # Compute combined risk
    combined_risk = calculate_risk(caption, eo_class, eo_conf)

    report = "🛰️ ISRO EO Mission Report\n\n"
    if caption:
        report += f"🖼️ Caption: {caption}\n"
    if eo_class != "Unknown":
        report += f"🌍 EO Analysis: {eo_class} ({eo_conf:.2f} confidence)\n"
    if combined_risk:
        report += f"⚠️ Risk Level: {combined_risk}\n"
    if keywords:
        report += f"🏷️ Keywords: {keywords}\n"
    if answer and question:
        report += f"❓ Q&A: {answer}\n"

    report += "\n✅ Summary:\n"
    if answer:
        report += f"{answer}\n"
    else:
        report += f"This image shows {caption}. Risk level is {combined_risk}. EO analysis: {eo_class}.\n"

    return report

# === Main analysis endpoint ===
@app.post("/analyze/")
async def analyze(file: UploadFile = File(...), question: str = Form("")):
    try:
        # Save uploaded image
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # === Core AI analysis ===
        caption_text = get_caption(file_path)
        keywords = extract_keywords(caption_text)
        eo_result = get_eo_analysis(file_path)  # {"class":..., "confidence":...}

        result = {
            "caption": caption_text,
            "keywords": keywords,
            "eo_analysis": eo_result,
        }

        # === Optional VQA answer if question is provided ===
        if question.strip():
            try:
                raw_answer = get_vqa_answer(file_path, question)
                if eo_result["class"].lower() in raw_answer.lower():
                    answer = raw_answer
                else:
                    answer = f"{raw_answer} (EO analysis: {eo_result['class']})"
                result["answer"] = answer
            except Exception as e:
                result["answer"] = f"Error generating answer: {str(e)}"

        # Generate human-readable report
        readable_message = format_readable_report(result, question)

        # === Cleanup uploaded file ===
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Warning: failed to delete {file_path}: {e}")

        return JSONResponse({"message": readable_message, "raw": result})

    except Exception as e:
        print(f"Error in /analyze/: {e}")
        return JSONResponse({"error": "Internal server error"}, status_code=500)
