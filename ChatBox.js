// app/components/ChatBox.js
"use client";

import { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [image, setImage] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("file", image); // must match FastAPI UploadFile
      if (question) formData.append("question", question);

      const res = await axios.post("http://localhost:8000/analyze/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResponse(res.data);
    } catch (err) {
      console.error("AxiosError:", err);
      setResponse({ message: "Error processing the image.", raw: {} });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-2xl border-2 border-green-300">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-700 text-center">
        🛰️ Multimodal AI Chat
      </h2>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-green-800 text-sm font-medium mb-2">
          Upload Satellite Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-3 bg-white border-2 border-green-300 rounded-lg text-green-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 transition-colors"
        />
      </div>

      {/* Question Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Ask a question about the image (optional)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-4 bg-white border-2 border-green-300 rounded-lg text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={sendMessage}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Image...
          </span>
        ) : (
          "🚀 Analyze Image"
        )}
      </button>

      {/* Response Section */}
      {response && (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-200 shadow-lg">
          <h3 className="font-bold text-xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-700">
            📊 AI Analysis Report
          </h3>

          <div className="space-y-4">
            {response.raw.caption && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <strong className="text-green-700">🖼️ Caption:</strong>
                <p className="text-green-900 mt-1">{response.raw.caption}</p>
              </div>
            )}

            {response.raw.answer && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-emerald-400">
                <strong className="text-emerald-700">❓ Q&A Answer:</strong>
                <p className="text-green-900 mt-1">{response.raw.answer}</p>
              </div>
            )}

            {response.raw.risk && (
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <strong className="text-red-700">⚠️ Risk Level:</strong>
                <p className="text-red-900 mt-1">{response.raw.risk.join(", ")}</p>
              </div>
            )}

            {response.raw.keywords && (
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                <strong className="text-amber-700">🏷️ Keywords:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {response.raw.keywords.map((keyword, index) => (
                    <span key={index} className="bg-amber-500/20 text-amber-800 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {response.raw.eo_analysis && (
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <strong className="text-purple-700">🌍 EO Analysis:</strong>
                <p className="text-purple-900 mt-1">
                  {response.raw.eo_analysis.class} 
                  <span className="text-emerald-700 ml-2">
                    (Confidence: {(response.raw.eo_analysis.confidence * 100).toFixed(1)}%)
                  </span>
                </p>
              </div>
            )}

            {response.raw.translation && (
              <div className="bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-400">
                <strong className="text-cyan-700">🌐 Translation:</strong>
                <p className="text-cyan-900 mt-1">{response.raw.translation}</p>
              </div>
            )}

            <div className="border-t border-green-200 pt-4 mt-4">
              <strong className="text-green-700 text-sm">Raw Analysis:</strong>
              <pre className="text-sm text-green-800 whitespace-pre-wrap mt-2 bg-green-50/50 p-3 rounded border border-green-200">
                {response.message}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}