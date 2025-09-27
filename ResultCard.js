"use client";
export default function ResultCard({ result }) {
  return (
    <div className="border p-4 mt-4 rounded shadow">
      <h3 className="font-bold mb-2">AI Result</h3>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
