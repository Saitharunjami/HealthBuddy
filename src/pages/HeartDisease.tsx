import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { jsPDF } from 'jspdf'; // Import jsPDF

const HeartDisease = () => {
  const defaultFormData = {
    age: '45',
    sex: '1',
    cp: '0',
    trestbps: '130',
    chol: '250',
    fbs: '0',
    restecg: '0',
    thalach: '150',
    exang: '0',
    oldpeak: '1.5',
    slope: '2',
    ca: '0',
    thal: '2',
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [result, setResult] = useState(null);
  const [resultColor, setResultColor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let key in formData) {
      if (formData[key] === '') {
        alert('Please fill all fields.');
        return;
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/heart_disease/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: Number(formData.age),
          sex: Number(formData.sex),
          cp: Number(formData.cp),
          trestbps: Number(formData.trestbps),
          chol: Number(formData.chol),
          fbs: Number(formData.fbs),
          restecg: Number(formData.restecg),
          thalach: Number(formData.thalach),
          exang: Number(formData.exang),
          oldpeak: Number(formData.oldpeak),
          slope: Number(formData.slope),
          ca: Number(formData.ca),
          thal: Number(formData.thal),
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);  // Log the API response

      setResult(data.Message);
      setResultColor(data.Message.toLowerCase() === 'heart disease detected' ? 'bg-red-500' : 'bg-green-500');
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };

  // PDF generation function
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
    doc.text('Heart Disease Risk Assessment Report', 20, 40);

    // Draw a horizontal line after title
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Add details of the test and inputs
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let yPos = 55;
    const inputData = [
      { label: 'Age', value: formData.age },
      { label: 'Sex (1 = male, 0 = female)', value: formData.sex },
      { label: 'Chest Pain Type', value: formData.cp },
      { label: 'Resting Blood Pressure (mm Hg)', value: formData.trestbps },
      { label: 'Cholesterol Level (mg/dL)', value: formData.chol },
      { label: 'Fasting Blood Sugar (1 = True, 0 = False)', value: formData.fbs },
      { label: 'Resting Electrocardiographic Results', value: formData.restecg },
      { label: 'Max Heart Rate Achieved (bpm)', value: formData.thalach },
      { label: 'Exercise Induced Angina (1 = Yes, 0 = No)', value: formData.exang },
      { label: 'Depression Induced by Exercise', value: formData.oldpeak },
      { label: 'Slope of Peak Exercise ST Segment', value: formData.slope },
      { label: 'Number of Major Vessels Colored by Fluoroscopy', value: formData.ca },
      { label: 'Thalassemia (3 = normal, 6 = fixed defect, 7 = reversable defect)', value: formData.thal }
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
    if (result === 'Heart disease detected') {
      recommendations = 'Recommendations:\n\n';
      recommendations += 'Please consult a healthcare provider for further tests.\n';
      recommendations += 'Lifestyle changes, including a balanced diet, regular exercise, and medication as prescribed, are highly recommended.\n';

      if (Number(formData.age) > 45) {
        recommendations += 'As you are over 45 years old, regular checkups are essential to monitor your cardiovascular health.\n';
      }
      if (Number(formData.chol) > 240) {
        recommendations += 'Your cholesterol level is higher than normal. It is recommended to reduce saturated fats and increase fiber intake.\n';
      }
      if (Number(formData.trestbps) > 140) {
        recommendations += 'Your blood pressure is on the higher side. Consider reducing salt intake, increasing physical activity, and managing stress.\n';
      }
      if (formData.exang === '1') {
        recommendations += 'You have exercise-induced angina. Work with your healthcare provider to establish a safe exercise routine.\n';
      }
      if (Number(formData.oldpeak) > 1) {
        recommendations += 'A higher depression level during exercise could indicate an underlying heart condition. Follow up with your doctor.\n';
      }
      if (formData.cp === '3') {
        recommendations += 'Your chest pain type indicates a higher likelihood of heart disease. Please take immediate action and consult with a healthcare provider.\n';
      }
    } else if (result === 'No heart disease detected') {
      recommendations = 'Recommendations:\n\n';
      recommendations += 'Keep up with a healthy lifestyle, including a balanced diet, regular exercise, and regular checkups.\n';
      if (Number(formData.age) > 45) {
        recommendations += 'It is still important to monitor your heart health regularly as you age.\n';
      }
    } else {
      recommendations = 'No specific recommendations due to an unexpected result. Please consult a healthcare provider for further advice.';
    }

    // Add the recommendations section with proper alignment
    const recommendationLines = doc.splitTextToSize(recommendations, 170);  // Wrap text for better alignment
    doc.text(recommendationLines, 20, yPos);
    yPos += recommendationLines.length * 6;  // Adjust vertical position based on lines


    // Add footer with page number
    doc.setFontSize(10);
    doc.text('Health Buddy - Heart Disease Risk Assessment', 20, yPos);
    doc.text(`Page 1`, 180, yPos);

    // Save the PDF
    doc.save('heart-disease-risk-report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">Heart Disease Risk Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              label: 'Age', field: 'age'
            }, {
              label: 'Sex (1 = male, 0 = female)', field: 'sex'
            }, {
              label: 'Chest Pain Type', field: 'cp'
            }, {
              label: 'Resting Blood Pressure (mm Hg)', field: 'trestbps'
            }, {
              label: 'Cholesterol Level (mg/dL)', field: 'chol'
            }, {
              label: 'Fasting Blood Sugar (1 = True, 0 = False)', field: 'fbs'
            }, {
              label: 'Resting Electrocardiographic Results', field: 'restecg'
            }, {
              label: 'Max Heart Rate Achieved (bpm)', field: 'thalach'
            }, {
              label: 'Exercise Induced Angina (1 = Yes, 0 = No)', field: 'exang'
            }, {
              label: 'Depression Induced by Exercise', field: 'oldpeak'
            }, {
              label: 'Slope of Peak Exercise ST Segment', field: 'slope'
            }, {
              label: 'Number of Major Vessels Colored by Fluoroscopy', field: 'ca'
            }, {
              label: 'Thalassemia (3 = normal, 6 = fixed defect, 7 = reversable defect)', field: 'thal'
            }].map((input) => (
              <div key={input.field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                <input
                  type="number"
                  value={formData[input.field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [input.field]: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>

        <div className={`mt-8 p-6 rounded-xl text-white ${resultColor}`}>
          <h2 className="text-2xl font-bold">Result: {result}</h2>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={generatePDF}
            className="bg-green-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-green-600 transition duration-300"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeartDisease;

