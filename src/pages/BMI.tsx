import React, { useState } from "react";
import { Scale } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";
import { supabase } from '../lib/supabase';  // Import supabase

const ObesityPrediction = () => {
  const defaultFormData = {
    Weight: 70, // Default weight in kg
    Height: 170, // Default height in cm
    Age: 25, // Default age
    Gender: "Male", // Default gender
    CALC: "Sometimes", // Default calorie calculation frequency
    FAVC: "yes", // Default for favoring calorie-rich food
    FCVC: 3, // Default frequency of consuming vegetables
    NCP: 3, // Default number of meals per day
    SCC: "no", // Default snacking
    SMOKE: "no", // Default smoking status
    CH2O: 2, // Default water intake in glasses
    family_history_with_overweight: "yes", // Default family history
    FAF: 1, // Default physical activity frequency
    TUE: 0.5, // Default time spent on physical activity in hours
    CAEC: "Sometimes", // Default fast food consumption
    MTRANS: "Public_Transportation", // Default mode of transportation
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [result, setResult] = useState(null);
  const [resultColor, setResultColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    for (let key in formData) {
      if (formData[key] === "") {
        alert("Please fill all fields.");
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/obesity/predict",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("API Response:", data);

      setResult(data.message);

      const message = data.message.toLowerCase();

      // Update color dynamically based on prediction
      if (message.includes("normal_weight") || message.includes("healthy")) {
        setResultColor("bg-green-500");
      } else if (message.includes("overweight") || message.includes("obesity")) {
        setResultColor("bg-red-500");
      } else {
        setResultColor("bg-gray-500");
      }
    } catch (error) {
      console.error("Error predicting obesity:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add website name and current date at the top
    const currentDate = new Date().toLocaleString();
    doc.setFont("times", "bold");
    doc.text("Health Buddy", 20, 20);
    doc.setFont("times", "normal");
    doc.text(`Report generated on: ${currentDate}`, 100, 20);

    // Add title for the report
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("Obesity Risk Assessment Report", 20, 40);

    // Draw a horizontal line after title
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Add details of the test and inputs
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    let yPos = 55;
    const inputData = Object.entries(formData).map(([key, value]) => ({
      label: key.replace(/_/g, " ").toUpperCase(),
      value,
    }));

    inputData.forEach((input) => {
      doc.text(`${input.label}: ${input.value}`, 20, yPos);
      yPos += 10;
    });

    // Add the result
    doc.setFont("times", "bold");
    doc.text(`Result: ${result}`, 20, yPos);
    yPos += 10;

    // Add a line separator
    doc.line(20, yPos, 190, yPos);
    yPos += 5;

    // Add personalized recommendations
    let recommendations = "";
    if (result.toLowerCase().includes("obesity")) {
      recommendations = "Recommendations:\n\n";
      recommendations +=
        "1. Engage in at least 30 minutes of moderate physical activity daily.\n";
      recommendations +=
        "2. Reduce calorie intake by avoiding processed and high-sugar foods.\n";
      recommendations +=
        "3. Include more vegetables and whole grains in your diet.\n";
      if (formData.FAF < 2) {
        recommendations +=
          "4. Increase physical activity frequency to 3-5 days a week.\n";
      }
      if (formData.FAVC === "yes") {
        recommendations +=
          "5. Reduce intake of calorie-dense foods and focus on nutrient-rich meals.\n";
      }
    } else if (result.toLowerCase().includes("normal_weight")) {
      recommendations = "Recommendations:\n\n";
      recommendations += "1. Maintain your current healthy lifestyle.\n";
      recommendations +=
        "2. Continue regular physical activity and a balanced diet.\n";
      recommendations += "3. Monitor your BMI and weight periodically.\n";
    } else {
      recommendations =
        "No specific recommendations available for this result. Consult a healthcare provider for personalized advice.";
    }

    doc.text(recommendations, 20, yPos);
    yPos += 30;

    // Add a line separator
    doc.line(20, yPos, 190, yPos);
    yPos += 5;

    // Add footer with page number
    doc.setFontSize(10);
    doc.text("Health Buddy - Obesity Risk Assessment", 20, yPos);
    doc.text(`Page 1`, 180, yPos);

    // Save the PDF
    doc.save("obesity-risk-report.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Scale className="w-8 h-8 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          Obesity Risk Assessment
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Weight (kg)", field: "Weight" },
              { label: "Height (cm)", field: "Height" },
              { label: "Age", field: "Age" },
              { label: "Gender", field: "Gender", type: "select", options: ["Male", "Female"] },
              { label: "Calories Calculation Frequency", field: "CALC", type: "select", options: ["Never", "Sometimes", "Frequently"] },
              { label: "Prefer Calorie-Rich Food?", field: "FAVC", type: "select", options: ["yes", "no"] },
              { label: "Vegetable Consumption (times/day)", field: "FCVC" },
              { label: "Number of Meals per Day", field: "NCP" },
              { label: "Do you snack between meals?", field: "SCC", type: "select", options: ["yes", "no"] },
              { label: "Do you smoke?", field: "SMOKE", type: "select", options: ["yes", "no"] },
              { label: "Water Intake (glasses/day)", field: "CH2O" },
              { label: "Family History of Overweight?", field: "family_history_with_overweight", type: "select", options: ["yes", "no"] },
              { label: "Physical Activity Frequency (days/week)", field: "FAF" },
              { label: "Time Spent on Physical Activity (hours/day)", field: "TUE" },
              { label: "Fast Food Consumption", field: "CAEC", type: "select", options: ["Never", "Sometimes", "Frequently"] },
              { label: "Mode of Transportation", field: "MTRANS", type: "select", options: ["Public_Transportation", "Walking", "Automobile", "Motorbike"] },
            ].map((input) => (
              <div key={input.field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                {input.type === "select" ? (
                  <select
                    value={formData[input.field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [input.field]: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    {input.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={formData[input.field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [input.field]: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                )}
                </div>
              ))}
            </div>
  
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Prediction
              </button>
            </div>
          </form>
        </div>
  
        {result && (
          <div
            className={`mt-6 p-4 text-white text-center font-bold rounded-lg ${resultColor}`}
          >
            {result}
          </div>
        )}
  
        {/* Button to generate PDF */}
        {result && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={generatePDF}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download Report as PDF
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default ObesityPrediction;
  
               
