import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation

const Hypertension = () => {
  const [formData, setFormData] = useState({
    Age: 40,
    Sex: 1,
    HighChol: 0,
    CholCheck: 1,
    BMI: 25,
    Smoker: 0,
    HeartDiseaseorAttack: 0,
    PhysActivity: 1,
    Fruits: 1,
    Veggies: 1,
    HvyAlcoholConsump: 0,
    GenHlth: 3,
    MentHlth: 0,
    PhysHlth: 0,
    DiffWalk: 0,
    Stroke: 0,
    Diabetes: 0,
  });

  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/hypertension/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to get a response from the server.' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // PDF generation function
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    const currentDate = new Date().toLocaleString();
    doc.setFont('times', 'bold');
    doc.text('Health Buddy', 20, 20);
    doc.setFont('times', 'normal');
    doc.text(`Report generated on: ${currentDate}`, 100, 20);

    // Title
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text('Hypertension Risk Assessment Report', 20, 40);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Input Details
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let yPos = 55;
    Object.keys(formData).forEach((key) => {
      doc.text(`${key}: ${formData[key]}`, 20, yPos);
      yPos += 10;
    });

    // Result
    doc.setFont('times', 'bold');
    doc.text(`Result: ${result?.prediction || 'N/A'}`, 20, yPos);
    yPos += 10;

    doc.setFont('times', 'normal');
    doc.line(20, yPos, 190, yPos);
    yPos += 5;

    // Recommendations based on the result
    let recommendations = '';
    if (result?.prediction === 'Hypertensive') {
      recommendations = `Recommendations:\n\n- Monitor blood pressure regularly.\n- Reduce sodium intake.\n- Adopt a balanced diet with plenty of fruits and vegetables.\n- Engage in regular physical activity.\n- Limit alcohol consumption.\n- Avoid smoking.\n- Manage stress effectively.`;
    } else if (result?.prediction === 'Not Hypertensive') {
      recommendations = `Recommendations:\n\n- Continue maintaining a healthy lifestyle.\n- Monitor blood pressure periodically.\n- Stay physically active and eat a balanced diet.\n- Keep stress levels in check.`;
    } else {
      recommendations = 'No specific recommendations available.';
    }

    doc.text(recommendations, 20, yPos);

    // Footer
    doc.setFontSize(10);
    doc.text('Health Buddy - Hypertension Risk Assessment', 20, 280);
    doc.text(`Page 1`, 180, 280);

    doc.save('hypertension-risk-report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Stethoscope className="w-8 h-8 text-rose-500" />
        <h1 className="text-2xl font-bold text-gray-800">Hypertension Prediction</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Predict
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Prediction Result:</h2>
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <p className="text-green-500">Prediction: {result.prediction}</p>
            )}
          </div>
        )}

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
    </div>
  );
};

export default Hypertension;
