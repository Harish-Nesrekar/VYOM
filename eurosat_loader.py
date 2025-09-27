import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# Path to trained weights
MODEL_PATH = "models/eurosat_resnet18_cpu_friendly.pth"

# EuroSAT classes
CLASS_NAMES = [
    "AnnualCrop", "Forest", "HerbaceousVegetation", "Highway",
    "Industrial", "Pasture", "PermanentCrop", "Residential",
    "River", "SeaLake"
]

# Define preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # match ResNet input size
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# Load model
def load_model():
    model = models.resnet18(weights=None)  # start with vanilla ResNet18
    model.fc = nn.Linear(model.fc.in_features, len(CLASS_NAMES))  # adjust final layer
    state_dict = torch.load(MODEL_PATH, map_location="cpu")  # CPU-friendly
    model.load_state_dict(state_dict)
    model.eval()
    return model

# Prediction function
def predict(image_path: str):
    model = load_model()
    image = Image.open(image_path).convert("RGB")
    x = transform(image).unsqueeze(0)  # add batch dimension
    with torch.no_grad():
        logits = model(x)
        pred_idx = logits.argmax(dim=1).item()
        confidence = torch.softmax(logits, dim=1)[0, pred_idx].item()

    return {
        "class": CLASS_NAMES[pred_idx],
        "confidence": round(confidence, 2)
    }
