import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { jsPDF } from 'jspdf';  // Import jsPDF

const Diabetes = () => {
  const defaultFormData = {
    pregnancies: '2',
    glucose: '120',
    bloodPressure: '80',
    skinThickness: '20',
    insulin: '85',
    bmi: '25',
    diabetesPedigreeFunction: '0.5',
    age: '45',
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [result, setResult] = useState(null);
  const [resultColor, setResultColor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    for (let key in formData) {
      if (formData[key] === '') {
        alert('Please fill all fields.');
        return;
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/diabetes/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Pregnancies: Number(formData.pregnancies),
          Glucose: Number(formData.glucose),
          BloodPressure: Number(formData.bloodPressure),
          SkinThickness: Number(formData.skinThickness),
          Insulin: Number(formData.insulin),
          BMI: Number(formData.bmi),
          DiabetesPedigreeFunction: Number(formData.diabetesPedigreeFunction),
          Age: Number(formData.age),
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      setResult(data.Message);

      const message = data.Message.toLowerCase();

      if (message === 'diabetes detected') {
        setResultColor('bg-red-500');
      } else if (message === 'no diabetes detected') {
        setResultColor('bg-green-500');
      } else {
        console.warn('Unexpected result:', data.Message);
        setResultColor('bg-gray-500');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };

  //pdf generation function

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set font style to make it formal and clean
    doc.setFont('times', 'normal');
    
    // Add website name and current date at the top
    const currentDate = new Date().toLocaleString();
    doc.setFont('times', 'bold');
    doc.text('Health Buddy', 20, 20);
    doc.setFont('times', 'normal');
    doc.text(`Report generated on: ${currentDate}`, 100, 20);
    
  
    // Add title for the report
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text('Diabetes Risk Assessment Report', 20, 40);
    
    // Draw a horizontal line after title
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
  
    // Add details of the test and inputs
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let yPos = 55;
    const inputData = [
      { label: 'Pregnancies', value: formData.pregnancies },
      { label: 'Glucose Level (mg/dL)', value: formData.glucose },
      { label: 'Blood Pressure (mm Hg)', value: formData.bloodPressure },
      { label: 'Skin Thickness (mm)', value: formData.skinThickness },
      { label: 'Insulin Level (μU/mL)', value: formData.insulin },
      { label: 'BMI', value: formData.bmi },
      { label: 'Diabetes Pedigree Function', value: formData.diabetesPedigreeFunction },
      { label: 'Age', value: formData.age }
    ];
  
    inputData.forEach(input => {
      doc.text(`${input.label}: ${input.value}`, 20, yPos);
      yPos += 10;
    });
  
    // Add the result
    doc.setFont('times', 'bold');
    doc.text(`Result: ${result}`, 20, yPos);
    yPos += 10;
    doc.setFont('times', 'normal');
  
    // Add a line separator
    doc.line(20, yPos, 190, yPos);
    yPos += 5;
  
    // Add personalized recommendations
    let recommendations = '';
    if (result === 'Diabetes detected') {
      recommendations = 'Recommendations:\n\n';
      if (Number(formData.glucose) > 140) {
        recommendations += 'Your glucose level is quite high. Please consult with a healthcare provider for further tests.\n';
      }
      if (Number(formData.bmi) > 30) {
        recommendations += 'Your BMI indicates that you are overweight. A healthy diet and regular exercise can help in managing your weight.\n';
      }
      if (Number(formData.age) > 45) {
        recommendations += 'Given your age, it is recommended to monitor your blood sugar levels regularly.\n';
      }
      if (Number(formData.insulin) < 50) {
        recommendations += 'Low insulin levels might require additional supervision. Consult with a healthcare professional.\n';
      }
      recommendations += 'Regular physical activity, a balanced diet, and routine medical checkups are important.\n';
    } else if (result === 'No diabetes detected') {
      recommendations = 'Recommendations:\n\n';
      if (Number(formData.bmi) > 25) {
        recommendations += 'Your BMI indicates that you may be overweight. Consider adopting a healthier diet and regular exercise.\n';
      }
      if (Number(formData.glucose) > 100 && Number(formData.glucose) <= 140) {
        recommendations += 'Your glucose levels are in the prediabetes range. Consider adopting lifestyle changes to prevent diabetes.\n';
      }
      if (Number(formData.age) > 45) {
        recommendations += 'Since you are over 45 years old, it is recommended to get regular screenings for diabetes.\n';
      }
      recommendations += 'Keep following a balanced diet, stay physically active, and avoid sedentary lifestyle habits.\n';
    } else {
      recommendations = 'No specific recommendations due to an unexpected result. Please consult a healthcare provider for further advice.';
    }
  
    // Add the recommendations section
    doc.setFont('times', 'normal');
    doc.text(recommendations, 20, yPos);
    yPos += 30;
  
    // Add footer with page number
    doc.setFontSize(10);
    doc.text('Health Buddy - Diabetes Risk Assessment', 20, yPos);
    doc.text(`Page 1`, 180, yPos);
  
    // Save the PDF
    doc.save('diabetes-risk-report.pdf');
  };

  
  
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">Diabetes Risk Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Pregnancies', field: 'pregnancies' },
              { label: 'Glucose Level (mg/dL)', field: 'glucose' },
              { label: 'Blood Pressure (mm Hg)', field: 'bloodPressure' },
              { label: 'Skin Thickness (mm)', field: 'skinThickness' },
              { label: 'Insulin Level (μU/mL)', field: 'insulin' },
              { label: 'BMI', field: 'bmi' },
              { label: 'Diabetes Pedigree Function', field: 'diabetesPedigreeFunction' },
              { label: 'Age', field: 'age' },
            ].map((input) => (
              <div key={input.field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                <input
                  type="number"
                  value={formData[input.field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [input.field]: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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

export default Diabetes;
