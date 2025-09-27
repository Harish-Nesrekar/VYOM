# inference/eo_analysis.py
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
from PIL import Image

# Path to trained weights
MODEL_PATH = "model_cache/eurosat_resnet18_cpu_friendly.pth"

# EuroSAT classes (10 land cover categories)
EUROSAT_CLASSES = [
    "Annual Crop", "Forest", "Herbaceous Vegetation", "Highway", "Industrial",
    "Pasture", "Permanent Crop", "Residential", "River", "Sea/Lake"
]

# Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

_model = None

def load_model():
    global _model
    if _model is None:
        model = models.resnet18(weights=None)
        model.fc = nn.Linear(model.fc.in_features, len(EUROSAT_CLASSES))
        state_dict = torch.load(MODEL_PATH, map_location="cpu")
        model.load_state_dict(state_dict, strict=False)
        model.eval()
        _model = model
    return _model

def get_eo_analysis(image_path: str):
    model = load_model()
    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.nn.functional.softmax(outputs[0], dim=0)
        conf, pred_class = torch.max(probs, 0)

    eo_class = EUROSAT_CLASSES[pred_class.item()]
    confidence = float(conf.item())

    # Risk based on EO class + confidence
    eo_risk = "Low"
    if eo_class.lower() in ["river", "sea/lake", "highway"] and confidence > 0.7:
        eo_risk = "High"
    elif eo_class.lower() in ["forest", "residential"] and confidence > 0.7:
        eo_risk = "Medium"

    return {
        "class": eo_class,
        "confidence": confidence,
        "risk": eo_risk,
        "note": "Land cover classification using EuroSAT"
    }
