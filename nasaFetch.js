import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY;

// Retry wrapper function
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      console.log(`NASA API request failed, retrying... (${attempt}/${retries})`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

export async function fetchNASAImage(lat, lon) {
  const url = `https://api.nasa.gov/planetary/earth/imagery?lat=${lat}&lon=${lon}&api_key=${NASA_API_KEY}`;

  try {
    const data = await fetchWithRetry(url);
    return data;
  } catch (err) {
    console.error("Failed to fetch NASA image after retries:", err.message);
    return null; // Graceful fallback
  }
}
