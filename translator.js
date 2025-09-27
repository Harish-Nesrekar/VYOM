"use client";

import React, { useEffect, useState } from "react";

const TranslateTTS = () => {
  const [synth, setSynth] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSynth(window.speechSynthesis);
    }

    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,kn,ta,te,ml,fr,de,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  const handleSpeak = () => {
    if (!synth) return;
    if (synth.speaking) synth.cancel();

    const text = document.body.innerText;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
  };

  const handlePause = () => {
    if (synth?.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (synth?.paused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (synth?.speaking || synth?.paused) {
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200"
      style={{ maxWidth: "280px" }}
      role="region"
      aria-label="Accessibility controls: translate and read aloud"
    >
      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
          <span className="text-xl">🌐</span>
          Accessibility Tools
        </h3>
        <p className="text-xs text-green-600 mt-1">Translate & Read Aloud</p>
      </div>

      {/* Translation dropdown */}
      <div 
        id="google_translate_element" 
        aria-label="Translate this page" 
        className="mb-4 transform hover:scale-105 transition-transform duration-200"
      ></div>

      {/* Text-to-Speech Controls */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleSpeak}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-3 focus:ring-green-400 shadow-lg hover:shadow-green-300 transition-all duration-300 flex items-center justify-center gap-2"
          aria-label="Start reading page text aloud"
        >
          <span className="text-base">🔊</span>
          Start Reading
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePause}
            disabled={!isSpeaking || isPaused}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-semibold rounded-lg hover:from-yellow-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 shadow-md transition-all duration-200 flex items-center justify-center gap-1"
            aria-label="Pause reading"
          >
            <span>⏸️</span>
            Pause
          </button>

          <button
            onClick={handleResume}
            disabled={!isPaused}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 shadow-md transition-all duration-200 flex items-center justify-center gap-1"
            aria-label="Resume reading"
          >
            <span>▶️</span>
            Resume
          </button>

          <button
            onClick={handleStop}
            disabled={!isSpeaking}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 shadow-md transition-all duration-200 flex items-center justify-center gap-1"
            aria-label="Stop reading"
          >
            <span>⏹️</span>
            Stop
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="text-center mt-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          isSpeaking ? 'bg-green-100 text-green-800' : 
          isPaused ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isSpeaking ? 'bg-green-500 animate-pulse' : 
            isPaused ? 'bg-yellow-500' : 
            'bg-gray-400'
          }`}></div>
          {isSpeaking ? 'Reading...' : isPaused ? 'Paused' : 'Ready'}
        </div>
      </div>
    </div>
  );
};

export default TranslateTTS;