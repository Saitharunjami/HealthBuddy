import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Brain,
  Activity,
  Smile,
  User,
} from 'lucide-react';
import { supabase, getProfile, getLatestHealthMetrics, type Profile, type HealthMetrics } from '../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHealthMetrics = useCallback(async () => {
    try {
      const { data, error } = await getLatestHealthMetrics();
      if (error) throw error;
      if (data) {
        setHealthMetrics(data);
      }
    } catch (error) {
      console.error('Error loading health metrics:', error);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    const { data } = await getProfile();
    if (data) {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadProfile(), loadHealthMetrics()]);
      setLoading(false);
    };
    loadData();
  }, [loadProfile, loadHealthMetrics, location.key]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const metrics = [
    { 
      label: 'Heart Rate', 
      value: healthMetrics ? `${healthMetrics.heart_rate} bpm` : '-- bpm', 
      trend: 'up', 
      color: 'text-green-500' 
    },
    { 
      label: 'Blood Pressure', 
      value: healthMetrics ? `${healthMetrics.blood_pressure_systolic}/${healthMetrics.blood_pressure_diastolic}` : '--/--', 
      trend: 'stable', 
      color: 'text-blue-500' 
    },
    { 
      label: 'BMI', 
      value: healthMetrics ? healthMetrics.bmi.toFixed(1) : '--', 
      trend: 'stable', 
      color: 'text-blue-500' 
    },
    { 
      label: 'Sleep', 
      value: healthMetrics ? `${healthMetrics.sleep_hours} hrs` : '-- hrs', 
      trend: 'down', 
      color: 'text-yellow-500' 
    },
  ];

  const recentPredictions = [
    { name: 'Heart Disease Risk', risk: 'Low', date: '2024-03-10' },
    { name: 'Diabetes Risk', risk: 'Moderate', date: '2024-03-09' },
    { name: 'Mental Health', risk: 'Good', date: '2024-03-08' },
  ];

  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {profile?.full_name || 'User'}!
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/update-health-data')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Update Health Data
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <User className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-gray-500">{metric.label}</p>
              <Activity className={`w-5 h-5 ${metric.color}`} />
            </div>
            <p className="text-2xl font-bold mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Predictions */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Health Predictions</h2>
        <div className="space-y-4">
          {recentPredictions.map((prediction) => (
            <div key={prediction.name} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                {prediction.name.includes('Heart') ? (
                  <Heart className="w-5 h-5 text-red-500" />
                ) : prediction.name.includes('Mental') ? (
                  <Brain className="w-5 h-5 text-purple-500" />
                ) : (
                  <Smile className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium">{prediction.name}</p>
                  <p className="text-sm text-gray-500">{prediction.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                prediction.risk === 'Low' ? 'bg-green-100 text-green-800' :
                prediction.risk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {prediction.risk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold">Schedule Check-up</h3>
          <p className="text-sm text-gray-500 mt-1">Book your next health assessment</p>
        </button>
        <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold">View Health Report</h3>
          <p className="text-sm text-gray-500 mt-1">Download your latest health report</p>
        </button>
        <button 
          onClick={() => navigate('/chat')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold">Chat with MED AI</h3>
          <p className="text-sm text-gray-500 mt-1">Get instant health advice</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;