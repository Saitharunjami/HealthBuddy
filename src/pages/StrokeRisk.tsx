import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation

const StrokeRisk = () => {
  const [formData, setFormData] = useState({
    age: '45',
    gender: 'male',
    hypertension: 'yes',
    heartDisease: 'yes',
    glucose: '140',
    bmi: '30',
    smoking: 'former',
    everMarried: 'yes',
    workType: 'Private',
    residenceType: 'Urban',
  });

  const [prediction, setPrediction] = useState(null);
  const [resultColor, setResultColor] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload for API request (One-hot encoding included)
    const payload = {
      age: parseFloat(formData.age),
      hypertension: formData.hypertension === 'yes' ? 1 : 0,
      heart_disease: formData.heartDisease === 'yes' ? 1 : 0,
      avg_glucose_level: parseFloat(formData.glucose),
      bmi: parseFloat(formData.bmi),
      gender_Male: formData.gender === 'male' ? 1 : 0,
      gender_Other: formData.gender === 'other' ? 1 : 0,
      ever_married_Yes: formData.everMarried === 'yes' ? 1 : 0,
      work_type_Private: formData.workType === 'Private' ? 1 : 0,
      'work_type_Self-employed': formData.workType === 'Self-employed' ? 1 : 0,
      work_type_children: formData.workType === 'children' ? 1 : 0,
      work_type_Never_worked: formData.workType === 'Never worked' ? 1 : 0,
      Residence_type_Urban: formData.residenceType === 'Urban' ? 1 : 0,
      'smoking_status_formerly smoked': formData.smoking === 'former' ? 1 : 0,
      'smoking_status_never smoked': formData.smoking === 'never' ? 1 : 0,
      smoking_status_smokes: formData.smoking === 'current' ? 1 : 0,
    };

    try {
      const response = await fetch('http://localhost:5000/stroke/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Prediction:', result);
      if (result.prediction) {
        setPrediction(result.prediction); // Store prediction result
        setResultColor(result.prediction === 'Stroke Detected' ? 'bg-red-500' : 'bg-green-500');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Function to generate the PDF report
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
    doc.text('Stroke Risk Assessment Report', 20, 40);
    
    // Draw a horizontal line after title
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    
    // Add details of the test and inputs
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let yPos = 55;
    const inputData = [
      { label: 'Age', value: formData.age },
      { label: 'Gender', value: formData.gender },
      { label: 'Hypertension', value: formData.hypertension },
      { label: 'Heart Disease', value: formData.heartDisease },
      { label: 'Average Glucose Level', value: formData.glucose },
      { label: 'BMI', value: formData.bmi },
      { label: 'Smoking Status', value: formData.smoking },
      { label: 'Ever Married', value: formData.everMarried },
      { label: 'Work Type', value: formData.workType },
      { label: 'Residence Type', value: formData.residenceType },
    ];
  
    inputData.forEach(input => {
      doc.text(`${input.label}: ${input.value}`, 20, yPos);
      yPos += 10;
    });
  
    // Add the result
    doc.setFont('times', 'bold');
    doc.text(`Result: ${prediction}`, 20, yPos);
    yPos += 10;
    doc.setFont('times', 'normal');
  
    // Add a line separator
    doc.line(20, yPos, 190, yPos);
    yPos += 5;
  
    // Add personalized recommendations
    let recommendations = '';
    if (prediction === 'Stroke Detected') {
      recommendations = 'Recommendations:\n\n';
      recommendations += 'It is recommended to consult with a healthcare provider for immediate actions.\n';
    } else {
      recommendations = 'Recommendations:\n\n';
      recommendations += 'Maintain a healthy lifestyle and follow up with regular health check-ups.\n';
    }
  
    // Add the recommendations section
    doc.setFont('times', 'normal');
    doc.text(recommendations, 20, yPos);
    yPos += 30;
  
    // Add footer with page number
    doc.setFontSize(10);
    doc.text('Health Buddy - Stroke Risk Assessment', 20, yPos);
    doc.text(`Page 1`, 180, yPos);
  
    // Save the PDF
    doc.save('stroke-risk-report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Brain className="w-8 h-8 text-purple-500" />
        <h1 className="text-2xl font-bold text-gray-800">Stroke Risk Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Age', field: 'age' },
              { label: 'Gender', field: 'gender' },
              { label: 'Hypertension', field: 'hypertension' },
              { label: 'Heart Disease', field: 'heartDisease' },
              { label: 'Average Glucose Level', field: 'glucose' },
              { label: 'BMI', field: 'bmi' },
              { label: 'Smoking Status', field: 'smoking' },
              { label: 'Ever Married', field: 'everMarried' },
              { label: 'Work Type', field: 'workType' },
              { label: 'Residence Type', field: 'residenceType' },
            ].map(input => (
              <div key={input.field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                {input.field === 'gender' || input.field === 'hypertension' || input.field === 'heartDisease' || input.field === 'smoking' || input.field === 'everMarried' || input.field === 'workType' || input.field === 'residenceType' ? (
                  <select
                    value={formData[input.field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [input.field]: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select {input.label}</option>
                    {input.field === 'gender' && (
                      <>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </>
                    )}
                    {input.field === 'hypertension' && (
                      <>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </>
                    )}
                    {input.field === 'heartDisease' && (
                      <>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </>
                    )}
                    {input.field === 'smoking' && (
                      <>
                        <option value="never">Never Smoked</option>
                        <option value="former">Former Smoker</option>
                        <option value="current">Current Smoker</option>
                      </>
                    )}
                    {input.field === 'everMarried' && (
                      <>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </>
                    )}
                    {input.field === 'workType' && (
                      <>
                        <option value="Private">Private</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="children">Children</option>
                        <option value="Never worked">Never worked</option>
                      </>
                    )}
                    {input.field === 'residenceType' && (
                      <>
                        <option value="Urban">Urban</option>
                        <option value="Rural">Rural</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[input.field]}
                    onChange={(e) => setFormData({ ...formData, [input.field]: e.target.value })}
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

          {prediction && (
        <div
          className={`mt-6 p-4 text-white text-center font-bold rounded-lg ${resultColor}`}
        >
          {prediction}
        </div>
      )}

      {/* Button to generate PDF */}
      {prediction && (
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

export default StrokeRisk;
