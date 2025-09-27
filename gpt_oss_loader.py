import subprocess
import json

def load_gpt_oss_model():
    """
    Returns a reference to the GPT-OSS model.
    Since Ollama manages models locally, we don't need to load weights manually.
    """
    return "gpt_oss:20b"  # your local Ollama model name

def gpt_oss_infer(model_name: str, input_text: str) -> str:
    """
    Run inference using GPT-OSS via Ollama CLI.
    Returns the model's text output.
    """
    try:
        # Call Ollama CLI
        result = subprocess.run(
            ["ollama", "run", model_name, input_text],
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"Error during GPT-OSS inference: {e.stderr.strip()}"
