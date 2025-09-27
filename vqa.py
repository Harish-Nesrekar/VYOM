from models.llava_loader import llava_model

def get_vqa_answer(image_path: str, question: str) -> str:
    """
    Generates an answer for a given image and question using LLAVA.
    """
    prompt = f"Image: {image_path}\nQuestion: {question}\nAnswer:"
    return llava_model(prompt)
