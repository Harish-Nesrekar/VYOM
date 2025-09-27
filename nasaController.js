import axios from "axios";

// Retry helper
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (err) {
      if (i < retries - 1) {
        console.warn(`Retrying NASA API (${i + 1}/${retries})...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
};

// Controller
export const fetchCurrentLocation = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  const nasaUrl = `https://api.nasa.gov/planetary/earth/assets?lon=${lon}&lat=${lat}&dim=0.1&api_key=${process.env.NASA_API_KEY}`;

  try {
    const data = await fetchWithRetry(nasaUrl, {}, 3, 2000);
    res.json({ success: true, data });
  } catch (err) {
    console.error("NASA API failed:", err.message);
    res.status(503).json({ error: "NASA API is unavailable. Please try again later." });
  }
};
