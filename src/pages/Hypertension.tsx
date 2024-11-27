import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { jsPDF } from 'jspdf';

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
  const [resultColor, setResultColor] = useState('');

  const labels = {
    Age: "Enter your age (in years):",
    Sex: "Specify your sex (1 for male, 0 for female):",
    HighChol: "Do you have high cholesterol? (1 for yes, 0 for no):",
    CholCheck: "Have you checked your cholesterol in the last 5 years? (1 for yes, 0 for no):",
    BMI: "Enter your Body Mass Index (BMI):",
    Smoker: "Are you a current smoker? (1 for yes, 0 for no):",
    HeartDiseaseorAttack: "Have you had heart disease or a heart attack? (1 for yes, 0 for no):",
    PhysActivity: "Do you participate in physical activities regularly? (1 for yes, 0 for no):",
    Fruits: "Do you consume fruits daily? (1 for yes, 0 for no):",
    Veggies: "Do you consume vegetables daily? (1 for yes, 0 for no):",
    HvyAlcoholConsump: "Do you consume alcohol heavily? (1 for yes, 0 for no):",
    GenHlth: "Rate your general health on a scale of 1 to 5 (1: Excellent, 5: Poor):",
    MentHlth: "How many days in the past month did you feel mentally unwell?",
    PhysHlth: "How many days in the past month did you feel physically unwell?",
    DiffWalk: "Do you have difficulty walking or climbing stairs? (1 for yes, 0 for no):",
    Stroke: "Have you ever had a stroke? (1 for yes, 0 for no):",
    Diabetes: "Do you have diabetes? (0 for no, 1 for yes):",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/hypertension/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      const message = data.prediction || 'N/A';

      setResult(message);

      if (message.toLowerCase() === 'hypertensive') {
        setResultColor('bg-red-500');
      } else if (message.toLowerCase() === 'not hypertensive') {
        setResultColor('bg-green-500');
      } else {
        setResultColor('bg-gray-500');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to get a response from the server.');
      setResultColor('bg-gray-500');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      doc.text(`${labels[key]} ${formData[key]}`, 20, yPos);
      yPos += 10;
    });

    // Result
    doc.setFont('times', 'bold');
    doc.text(`Result: ${result}`, 20, yPos);
    yPos += 10;

    // Add a line separator
    doc.line(20, yPos, 190, yPos);
    yPos += 5;

    // Recommendations
    doc.setFont('times', 'bold');
    doc.text('Recommendations:', 20, yPos);
    yPos += 10;
    doc.setFont('times', 'normal');

    let recommendations = '';
    if (result === 'Hypertensive') {
      recommendations = `- Monitor your blood pressure regularly.\n`;
      if (formData.BMI > 25) recommendations += '- Maintain a healthy weight to reduce pressure on your heart.\n';
      if (formData.Smoker === 1) recommendations += '- Quit smoking to improve cardiovascular health.\n';
      if (formData.HvyAlcoholConsump === 1) recommendations += '- Limit alcohol consumption.\n';
      if (formData.Fruits === 0 || formData.Veggies === 0)
        recommendations += '- Include more fruits and vegetables in your diet.\n';
      recommendations += '- Engage in regular physical activity to strengthen your heart.\n';
    } else if (result === 'Not Hypertensive') {
      recommendations = `- Maintain your healthy lifestyle to keep hypertension at bay.\n`;
      if (formData.Age > 45) recommendations += '- Continue regular check-ups as you are above 45 years old.\n';
      recommendations += '- Eat a balanced diet and stay physically active.\n';
    } else {
      recommendations = 'No specific recommendations due to an unexpected result.';
    }

    recommendations.split('\n').forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 10;
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Health Buddy - Hypertension Risk Assessment', 20, 280);
    doc.text('Page 1', 180, 280);

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
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels[key]}</label>
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={labels[key]}
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
      </div>

      {result && (
        <div
          className={`mt-6 p-4 text-white text-center font-bold rounded-lg ${resultColor}`}
        >
          {result}
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
  );
};

export default Hypertension;
