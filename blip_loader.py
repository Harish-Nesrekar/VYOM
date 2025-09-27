from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

# Load model and processor once
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

class BlipModel:
    def __init__(self, model, processor):
        self.model = model
        self.processor = processor

    def generate_caption(self, image_path: str) -> str:
        img = Image.open(image_path).convert("RGB")
        inputs = self.processor(img, return_tensors="pt")
        out = self.model.generate(**inputs)
        caption = self.processor.decode(out[0], skip_special_tokens=True)
        return caption

# Singleton instance for easy import
blip_model = BlipModel(model, processor)
