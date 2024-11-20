import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeartDisease from './pages/HeartDisease';
import Diabetes from './pages/Diabetes';
import StrokeRisk from './pages/StrokeRisk';
import BMI from './pages/BMI';
import MentalHealth from './pages/MentalHealth';
import SkinDisease from './pages/SkinDisease';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import UpdateHealthData from './pages/UpdateHealthData';
import SleepApnea from './pages/SleepApnea';
import Respiratory from './pages/Respiratory';
import Hypertension from './pages/Hypertension';
import DietFitness from './pages/DietFitness';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update-health-data" element={<UpdateHealthData />} />
            <Route path="/heart-disease" element={<HeartDisease />} />
            <Route path="/diabetes" element={<Diabetes />} />
            <Route path="/stroke-risk" element={<StrokeRisk />} />
            <Route path="/bmi" element={<BMI />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/skin-disease" element={<SkinDisease />} />
            <Route path="/sleep-apnea" element={<SleepApnea />} />
            <Route path="/respiratory" element={<Respiratory />} />
            <Route path="/hypertension" element={<Hypertension />} />
            <Route path="/diet-fitness" element={<DietFitness />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;