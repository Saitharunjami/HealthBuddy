import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import { jsPDF } from 'jspdf'; // Import jsPDF

const MentalHealth = () => {
  const defaultFormData = {
    Age: '30',
    Gender: '0',
    self_employed: '0',
    family_history: '1',
    work_interfere: '5',
    no_employees: '50',
    remote_work: '1',
    tech_company: '1',
    benefits: '1',
    care_options: '1',
    wellness_program: '1',
    seek_help: '1',
    anonymity: '1',
    leave: '2',
    mental_health_consequence: '1',
    phys_health_consequence: '0',
    coworkers: '2',
    supervisor: '1',
    mental_health_interview: '1',
    phys_health_interview: '1',
    mental_vs_physical: '1',
    obs_consequence: '0',
  };

  const inputLabels = {
    Age: 'Your Age',
    Gender: 'Gender (0: Male, 1: Female, 2: Other)',
    self_employed: 'Are you self-employed? (0: No, 1: Yes)',
    family_history: 'Family History of Mental Health Issues (0: No, 1: Yes)',
    work_interfere: 'Work Interference with Mental Health (1: Never, 5: Always)',
    no_employees: 'Number of Employees in Your Company',
    remote_work: 'Do You Work Remotely? (0: No, 1: Yes)',
    tech_company: 'Do You Work in a Tech Company? (0: No, 1: Yes)',
    benefits: 'Does Your Company Offer Mental Health Benefits? (0: No, 1: Yes)',
    care_options: 'Are Mental Health Care Options Available? (0: No, 1: Yes)',
    wellness_program: 'Does Your Company Have a Wellness Program? (0: No, 1: Yes)',
    seek_help: 'Encouragement to Seek Help for Mental Health (0: No, 1: Yes)',
    anonymity: 'Is Anonymity Protected for Mental Health Discussions? (0: No, 1: Yes)',
    leave: 'Ease of Taking Leave for Mental Health (0: Very Difficult, 2: Neutral, 4: Very Easy)',
    mental_health_consequence: 'Consequences for Discussing Mental Health (0: No, 1: Yes)',
    phys_health_consequence: 'Consequences for Discussing Physical Health (0: No, 1: Yes)',
    coworkers: 'Comfort Talking to Coworkers About Mental Health (0: No, 1: Somewhat, 2: Yes)',
    supervisor: 'Comfort Talking to Supervisor About Mental Health (0: No, 1: Somewhat, 2: Yes)',
    mental_health_interview: 'Would You Bring Up Mental Health in an Interview? (0: No, 1: Maybe, 2: Yes)',
    phys_health_interview: 'Would You Bring Up Physical Health in an Interview? (0: No, 1: Maybe, 2: Yes)',
    mental_vs_physical: 'Importance of Mental vs. Physical Health (0: Less Important, 1: Same Importance)',
    obs_consequence: 'Observed Consequences for Others with Mental Health Issues (0: No, 1: Yes)',
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);
  const [resultColor, setResultColor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/mental_health/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, Number(value)])
          )
        ),
      });

      const data = await response.json();
      setResult(data.Message);
      setProbability(data.Probability * 100); // Convert to percentage

      const message = data.Message.toLowerCase();
      setResultColor(message === 'treatment needed' ? 'bg-red-500' : 'bg-green-500');
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };

  const generateRecommendations = () => {
    let recommendations = '';

    if (result === 'Treatment needed') {
      recommendations += 'Based on your responses, you may benefit from consulting a mental health professional.\n';
      if (formData.work_interfere > 3) {
        recommendations += 'Consider strategies to manage work interference, such as better time management or discussing workload with your supervisor.\n';
      }
      if (formData.family_history === '1') {
        recommendations += 'Since there is a family history of mental health issues, regular check-ups with a mental health professional are advised.\n';
      }
      if (formData.anonymity === '0') {
        recommendations += 'Encourage your workplace to prioritize anonymity in mental health discussions.\n';
      }
      if (formData.benefits === '0') {
        recommendations += 'Advocate for mental health benefits at your workplace to make support more accessible.\n';
      }
      if (formData.leave < 2) {
        recommendations += 'Discuss with your HR department to make mental health leave policies more flexible.\n';
      }
    } else {
      recommendations += 'Your responses indicate no immediate need for mental health treatment.\n';
      recommendations += 'However, maintaining regular self-care routines and checking in on your mental health is important.\n';
      if (formData.remote_work === '1') {
        recommendations += 'Since you work remotely, stay connected with coworkers through virtual meetings to avoid isolation.\n';
      }
      if (formData.no_employees > 100) {
        recommendations += 'Large companies may have mental health resources. Check with HR to utilize them.\n';
      }
    }

    return recommendations;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const currentDate = new Date().toLocaleString();
    doc.setFont('times', 'bold');
    doc.text('Health Buddy', 20, 20);
    doc.setFont('times', 'normal');
    doc.text(`Report generated on: ${currentDate}`, 100, 20);

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text('Mental Health Risk Assessment Report', 20, 40);

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let yPos = 55;
    const pageHeight = doc.internal.pageSize.height - 20;

    Object.keys(formData).forEach((key) => {
      if (yPos > pageHeight) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${inputLabels[key]}: ${formData[key]}`, 20, yPos);
      yPos += 10;
    });

    if (yPos > pageHeight) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont('times', 'bold');
    doc.text(`Result: ${result}`, 20, yPos);
    yPos += 10;

    if (yPos > pageHeight) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(`Probability of getting a mental health issue in the future: ${probability.toFixed(2)}%`, 20, yPos);
    yPos += 10;

    const recommendations = generateRecommendations();
    const recommendationLines = doc.splitTextToSize(recommendations, 170);
    recommendationLines.forEach((line) => {
      if (yPos > pageHeight) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });

    doc.save('mental-health-risk-report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Smile className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">Mental Health Risk Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(defaultFormData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {inputLabels[key]}
                </label>
                <input
                  type="number"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]:
                      e.target.value })}
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
    
          {result && probability !== null && (
            <div
              className={`mt-6 p-4 text-white text-center font-bold rounded-lg ${resultColor}`}
            >
              <p>{result}</p>
              <p>Probability of getting a mental health issue in the future: {probability.toFixed(2)}%</p>
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
    
    export default MentalHealth;
    
