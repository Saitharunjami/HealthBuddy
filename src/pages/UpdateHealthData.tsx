import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLatestHealthMetrics, updateHealthMetrics, type HealthMetrics } from '../lib/supabase';

const UpdateHealthData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [healthData, setHealthData] = useState<Partial<HealthMetrics>>({
    heart_rate: 72,
    blood_pressure_systolic: 120,
    blood_pressure_diastolic: 80,
    bmi: 22.5,
    sleep_hours: 7.5,
  });

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const { data, error } = await getLatestHealthMetrics();
      if (error) throw error;
      if (data) {
        setHealthData(data);
      }
    } catch (error: any) {
      console.error('Error loading health data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to load health data' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await updateHealthMetrics(healthData);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Health data updated successfully!' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Error updating health data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update health data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof HealthMetrics, value: number) => {
    setHealthData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">Update Health Data</h1>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={healthData.heart_rate}
                onChange={(e) => handleInputChange('heart_rate', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="40"
                max="200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure (Systolic)
              </label>
              <input
                type="number"
                value={healthData.blood_pressure_systolic}
                onChange={(e) => handleInputChange('blood_pressure_systolic', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="70"
                max="200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure (Diastolic)
              </label>
              <input
                type="number"
                value={healthData.blood_pressure_diastolic}
                onChange={(e) => handleInputChange('blood_pressure_diastolic', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="40"
                max="130"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BMI
              </label>
              <input
                type="number"
                value={healthData.bmi}
                onChange={(e) => handleInputChange('bmi', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="10"
                max="50"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sleep Hours
              </label>
              <input
                type="number"
                value={healthData.sleep_hours}
                onChange={(e) => handleInputChange('sleep_hours', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                max="24"
                step="0.5"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Health Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHealthData;