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
import HealthAnalytics from '../components/HealthAnalytics';


const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]); // Predictions state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

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

  const loadPredictions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('disease_predictions')
        .select('disease_type, risk_level, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadProfile(), loadHealthMetrics(), loadPredictions()]);
      setLoading(false);
    };
    loadData();
  }, [loadProfile, loadHealthMetrics, loadPredictions, location.state?.refresh]);

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

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'heart_disease':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'stroke_risk':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'mental_health':
        return <Smile className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPredictionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

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

            {/* Tabs */}
            <div className="flex space-x-4 border-b">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'overview'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'analytics'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>

      

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
          {predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  {getIcon(prediction.disease_type)}
                  <div>
                    <p className="font-medium">{formatPredictionType(prediction.disease_type)}</p>
                    <p className="text-sm text-gray-500">{formatDate(prediction.created_at)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getRiskColor(prediction.risk_level)}`}>
                  {prediction.risk_level} Risk
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No predictions yet. Try our health assessment tools!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => navigate('/appointments')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold">Schedule Checkup</h3>
          <p className="text-sm text-gray-500 mt-1">Book your next health assessment</p>
        </button>
        <button 
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold">Download reports</h3>
          <p className="text-sm text-gray-500 mt-1">Download all the test reports</p>
        </button>
        <button 
          onClick={() => navigate('/chat')}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold">Chat with MED AI</h3>
          <p className="text-sm text-gray-500 mt-1">Get instant health advice</p>
        </button>
      </div>
      </>
      ) : (
      <HealthAnalytics />
      )}
    </div>
    
  );
};

export default Dashboard;
