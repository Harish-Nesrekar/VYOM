"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AutoSatelliteAnalysis({ userLocation, onAIResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchNASAImage(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  const fetchNASAImage = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await api.get("/nasa/current", {
        params: { lat, lon },
      });
      onAIResult(res.data); // send AI result to Dashboard
    } catch (err) {
      console.error(err);
      setError("Failed to fetch/analyze NASA image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-green-300 p-6 rounded-2xl shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
      <h2 className="font-bold mb-4 text-xl text-green-900 flex items-center gap-2">
        <span className="text-2xl">🛰️</span>
        Automatic Satellite Analysis
      </h2>
      
      {loading && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-green-100 rounded-lg border border-green-200">
          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-800 font-medium">Fetching and analyzing satellite image...</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 rounded-lg border border-red-300">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      <p className="text-green-800 text-base bg-white/50 p-3 rounded-lg border border-green-200">
        An image of your current location will be analyzed automatically using NASA satellite data.
      </p>
    </div>
  );
}