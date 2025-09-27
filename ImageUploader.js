"use client";

import { useState, useEffect } from "react";
import api from "../utils/api";

export default function ImageUploader({ userLocation, onImageFetch }) {
  const [lat, setLat] = useState(userLocation.lat || "");
  const [lon, setLon] = useState(userLocation.lng || "");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill location when userLocation updates
  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      setLat(userLocation.lat);
      setLon(userLocation.lng);
    }
  }, [userLocation]);

  const fetchImage = async () => {
    if (!lat || !lon || !date) {
      setError("Latitude, longitude, and date are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/nasa/image", {
        params: { lat, lon, date },
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedImage = {
        url: res.data.image.url,
        title: res.data.image.title || "Satellite Image",
        lat,
        lon,
      };

      setImage(fetchedImage);

      // Pass image to parent (EOMapViewer)
      onImageFetch(fetchedImage);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold mb-2">Fetch Satellite Image</h2>

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Longitude"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={fetchImage}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Image"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {image && (
        <img
          src={image.url}
          alt="Satellite"
          className="mt-4 rounded shadow w-full object-cover"
        />
      )}
    </div>
  );
}
