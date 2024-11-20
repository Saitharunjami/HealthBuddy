import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { jsPDF } from 'jspdf';

const SleepApnea = () => {
  const defaultFormData = {
    Gender: "Male", // Default gender
    Age: 30, // Default age
    Occupation: "Doctor", // Default occupation
    "Sleep Duration": 6.5, // Default sleep duration
    "Quality of Sleep": 7, // Default quality of sleep
    "Physical Activity Level": 50, // Default physical activity level
    "Stress Level": 5, // Default stress level
    "BMI Category": "Normal", // Default BMI category
    "Heart Rate": 72, // Default heart rate
    "Daily Steps": 8000, // Default daily steps
    "Systolic BP": 120, // Default systolic blood pressure
    "Diastolic BP": 80, // Default diastolic blood pressure
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [result, setResult] = useState(null);
  const [resultColor, setResultColor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    for (let key in formData) {
      if (formData[key] === '' || formData[key] === null) {
        alert(`Please fill in the field: ${key}`);
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/sleep_apnea/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('API Response:', data);

      setResult(data.message);

      // Set color dynamically based on result
      if (data.message.toLowerCase().includes('high risk')) {
        setResultColor('bg-red-500');
      } else if (data.message.toLowerCase().includes('low risk')) {
        setResultColor('bg-green-500');
      } else {
        setResultColor('bg-gray-500');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header and current date
    const currentDate = new Date().toLocaleString();
    doc.setFont('times', 'bold');
    doc.text('Health Buddy', 20, 20);
    doc.setFont('times', 'normal');
    doc.text(`Report generated on: ${currentDate}`, 100, 20);

    // Add title
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text('Sleep Apnea Assessment Report', 20, 40);
    doc.line(20, 45, 190, 45); // Separator line

    // Add input details
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let yPos = 55;
    const inputDetails = Object.entries(formData);
    inputDetails.forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, yPos);
      yPos += 10;
    });

    // Add the result
    doc.setFont('times', 'bold');
    doc.text(`Result: ${result}`, 20, yPos);
    yPos += 10;
    doc.line(20, yPos, 190, yPos); // Line separator
    yPos += 5;

    // Add personalized recommendations
    doc.setFont('times', 'bold');
    doc.text('Recommendations:', 20, yPos);
    yPos += 10;

    doc.setFont('times', 'normal');
    const recommendations = [];
    if (result && result.toLowerCase().includes('high risk')) {
      recommendations.push(
        '1. Consult a sleep specialist for further evaluation.',
        '2. Avoid alcohol and sedatives before bedtime.',
        '3. Consider weight management if BMI is high.',
        '4. Establish a regular sleep schedule.',
        '5. Use proper sleeping posture to improve breathing.'
      );
    } else if (result && result.toLowerCase().includes('low risk')) {
      recommendations.push(
        '1. Maintain a balanced lifestyle to prevent risks.',
        '2. Engage in regular physical activity.',
        '3. Monitor your sleep quality periodically.'
      );
    } else {
      recommendations.push(
        'No specific recommendations. Please consult a specialist for more advice.'
      );
    }

    recommendations.forEach((rec) => {
      doc.text(rec, 20, yPos);
      yPos += 10;
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Health Buddy - Sleep Apnea Assessment', 20, 280);
    doc.text('Page 1', 180, 280);

    // Save the PDF
    doc.save('sleep-apnea-assessment-report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Moon className="w-8 h-8 text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-800">Sleep Apnea Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Gender', field: 'Gender', type: 'select', options: ['Male', 'Female'] },
              { label: 'Age', field: 'Age', type: 'number', placeholder: 'Enter your age' },
              { label: 'Occupation', field: 'Occupation', type: 'select', options: [
                'Accountant', 'Doctor', 'Engineer', 'Lawyer', 'Manager', 'Nurse', 'Sales Representative',
                'Salesperson', 'Scientist', 'Software Engineer', 'Teacher'
              ] },
              { label: 'Sleep Duration (hours)', field: 'Sleep Duration', type: 'number', step: 0.1 },
              { label: 'Quality of Sleep (1-10)', field: 'Quality of Sleep', type: 'number' },
              { label: 'Physical Activity Level (%)', field: 'Physical Activity Level', type: 'number' },
              { label: 'Stress Level (1-10)', field: 'Stress Level', type: 'number' },
              { label: 'BMI Category', field: 'BMI Category', type: 'select', options: ['Underweight', 'Normal', 'Overweight', 'Obese'] },
              { label: 'Heart Rate (bpm)', field: 'Heart Rate', type: 'number' },
              { label: 'Daily Steps', field: 'Daily Steps', type: 'number' },
              { label: 'Systolic BP (mmHg)', field: 'Systolic BP', type: 'number' },
              { label: 'Diastolic BP (mmHg)', field: 'Diastolic BP', type: 'number' },
            ].map((input) => (
              <div key={input.field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                {input.type === 'select' ? (
                  <select
                    value={formData[input.field]}
                    onChange={(e) => setFormData({ ...formData, [input.field]: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {input.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={input.type}
                    value={formData[input.field]}
                    onChange={(e) => setFormData({ ...formData, [input.field]: e.target.value })}
                    placeholder={input.placeholder}
                    step={input.step}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

export default SleepApnea;

