"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon for Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Dynamic import for React-Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Map risk levels to colors
const riskColors = {
  Low: "green",
  Medium: "orange",
  High: "red",
};

export default function EOMapViewer({ userLocation, images = [] }) {
  const center =
    userLocation?.lat && userLocation?.lng
      ? [userLocation.lat, userLocation.lng]
      : [15.85, 74.5];

  const getIcon = (risk = "Low") =>
    new L.Icon({
      iconUrl:
        risk === "High"
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
          : risk === "Medium"
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"
          : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  return (
    <div className="border-2 border-green-200 p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-green-50 to-emerald-100">
      <h2 className="font-bold mb-4 text-2xl text-green-900 text-center">
        🌍 EO Map Viewer
      </h2>
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={true}
        style={{ 
          height: "450px", 
          width: "100%",
          borderRadius: "12px",
          border: "2px solid #10b981"
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userLocation?.lat && userLocation?.lng && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={getIcon("Low")}>
            <Popup className="custom-popup">
              <div className="text-center p-2">
                <span className="text-green-600 font-bold">📍 Your Location</span>
              </div>
            </Popup>
          </Marker>
        )}

        {images.map((img, i) => (
          <Marker
            key={i}
            position={[img.lat, img.lon]}
            icon={getIcon(img.risk || "Low")}
          >
            <Popup className="custom-popup">
              <div className="flex flex-col items-center p-2 min-w-[200px]">
                <p className="font-bold text-green-800 text-sm mb-2 text-center">{img.title}</p>
                {img.url && (
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-40 h-32 object-cover mt-1 rounded-lg border-2 border-green-200 shadow-md"
                  />
                )}
                {img.summary && (
                  <p className="text-gray-700 text-xs mt-2 p-2 bg-green-50 rounded-lg whitespace-pre-wrap border border-green-100">
                    {img.summary}
                  </p>
                )}
                {img.risk && (
                  <p className={`text-sm font-bold mt-2 px-3 py-1 rounded-full ${
                    img.risk === "High" ? "bg-red-100 text-red-800" :
                    img.risk === "Medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    ⚠️ Risk: {img.risk}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Custom CSS for popup styling */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border-radius: 12px;
          border: 2px solid #10b981;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: #10b981;
        }
        
        .leaflet-container {
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        
        .leaflet-popup-content {
          margin: 8px 12px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}