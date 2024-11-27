import React, { useState, useRef } from "react";
import { ScanLine, Upload, X } from "lucide-react";

const SkinDisease = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [reasons, setReasons] = useState<string[] | null>(null);
  const [preventionSteps, setPreventionSteps] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Clear any previous results
      setReasons(null);
      setPreventionSteps(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    setResult(null);
    setReasons(null);
    setPreventionSteps(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image before predicting.");
      return;
    }

    setLoading(true);
    setResult(null);
    setReasons(null);
    setPreventionSteps(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/skin_disease/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setResult(`Predicted Disease: ${data.predicted_class}`);
        setReasons(data.reasons);
        setPreventionSteps(data.prevention_steps);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      setResult("An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ScanLine className="w-8 h-8 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">Skin Disease Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Upload Skin Image</label>
            <div className="flex items-center justify-center w-full">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Skin condition"
                    className="max-w-full h-auto max-h-64 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, or JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </form>

        {/* Display Result */}
        {result && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            {result}
          </div>
        )}

        {/* Display Reasons */}
        {reasons && (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            <h2 className="font-semibold text-lg">Possible Reasons:</h2>
            <ul className="list-disc ml-6 mt-2">
              {reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Display Prevention Steps */}
        {preventionSteps && (
          <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
            <h2 className="font-semibold text-lg">Prevention Steps:</h2>
            <ul className="list-disc ml-6 mt-2">
              {preventionSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinDisease;
