import asyncio

async def translate_text(text: str, target_lang="hi") -> str:
    """
    Placeholder async translation function.
    Replace with actual API call if needed.
    """
    await asyncio.sleep(0.1)  # simulate async work
    return f"[{target_lang}] {text}"
