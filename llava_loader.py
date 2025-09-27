import subprocess

def load_llava_model():
    """
    Returns the local Ollama LLAVA model reference.
    """
    return "llava:latest"  # your local Ollama LLAVA model

def llava_model(prompt: str) -> str:
    """
    Run inference using LLAVA via Ollama CLI.
    """
    model_name = load_llava_model()
    try:
        result = subprocess.run(
            ["ollama", "run", model_name, prompt],
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"Error during LLAVA inference: {e.stderr.strip()}"
