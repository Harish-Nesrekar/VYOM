from models.blip_loader import blip_model

def get_caption(image_path: str) -> str:
    """
    Generate a caption for an image using BLIP.
    """
    return blip_model.generate_caption(image_path)
