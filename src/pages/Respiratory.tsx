import React, { useState } from 'react';
import { Waves } from 'lucide-react';

const Respiratory = () => {
  const [formData, setFormData] = useState({
    breathlessness: '',
    cough: '',
    wheezing: '',
    chestPain: '',
    smoking: '',
    exposure: '',
    peakFlow: '',
    oxygenSaturation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Waves className="w-8 h-8 text-cyan-500" />
        <h1 className="text-2xl font-bold text-gray-800">Respiratory Health Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breathlessness Level</label>
              <select
                value={formData.breathlessness}
                onChange={(e) => setFormData({ ...formData, breathlessness: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select level</option>
                <option value="none">None</option>
                <option value="mild">Mild - Only During Exercise</option>
                <option value="moderate">Moderate - During Light Activity</option>
                <option value="severe">Severe - At Rest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cough Frequency</label>
              <select
                value={formData.cough}
                onChange={(e) => setFormData({ ...formData, cough: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="none">No Cough</option>
                <option value="occasional">Occasional</option>
                <option value="frequent">Frequent</option>
                <option value="persistent">Persistent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wheezing</label>
              <select
                value={formData.wheezing}
                onChange={(e) => setFormData({ ...formData, wheezing: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="sometimes">Sometimes</option>
                <option value="often">Often</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chest Pain</label>
              <select
                value={formData.chestPain}
                onChange={(e) => setFormData({ ...formData, chestPain: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="sometimes">Sometimes</option>
                <option value="often">Often</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
              <select
                value={formData.smoking}
                onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="never">Never Smoked</option>
                <option value="former">Former Smoker</option>
                <option value="current">Current Smoker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Environmental Exposure</label>
              <select
                value={formData.exposure}
                onChange={(e) => setFormData({ ...formData, exposure: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select exposure</option>
                <option value="none">None</option>
                <option value="dust">Dust</option>
                <option value="chemicals">Chemicals</option>
                <option value="smoke">Second-hand Smoke</option>
                <option value="multiple">Multiple Exposures</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peak Flow (L/min)</label>
              <input
                type="number"
                value={formData.peakFlow}
                onChange={(e) => setFormData({ ...formData, peakFlow: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter peak flow reading"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
              <input
                type="number"
                value={formData.oxygenSaturation}
                onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter oxygen saturation"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Respiratory;