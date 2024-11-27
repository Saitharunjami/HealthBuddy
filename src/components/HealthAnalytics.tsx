import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import HeartRateChart from './charts/HeartRateChart';
import BloodPressureChart from './charts/BloodPressureChart';
import BMIChart from './charts/BMIChart';
import SleepChart from './charts/SleepChart';

const HealthAnalytics: React.FC = () => {
  const [healthData, setHealthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(30);

        if (error) throw error;
        setHealthData(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading health data: {error}
      </div>
    );
  }

  if (healthData.length === 0) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
        No health data available. Start tracking your health metrics to see analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeartRateChart data={healthData} />
        <BloodPressureChart data={healthData} />
        <BMIChart data={healthData} />
        <SleepChart data={healthData} />
      </div>
    </div>
  );
};

export default HealthAnalytics;