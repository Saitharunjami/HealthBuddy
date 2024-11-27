import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Activity,
  Brain,
  Scale,
  Smile,
  ScanLine,
  Moon,
  Stethoscope,
  Apple,
  MessageSquare,
  LogOut,
  User,
  Waves,
  Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
    { icon: User, text: 'Profile', path: '/profile' },
    { icon: Calendar, text: 'Appointments', path: '/appointments' },
    { icon: Heart, text: 'Heart Disease', path: '/heart-disease' },
    { icon: Activity, text: 'Diabetes', path: '/diabetes' },
    { icon: Brain, text: 'Stroke Risk', path: '/stroke-risk' },
    { icon: Scale, text: 'BMI & Obesity', path: '/bmi' },
    { icon: Smile, text: 'Mental Health', path: '/mental-health' },
    { icon: ScanLine, text: 'Skin Disease', path: '/skin-disease' },
    { icon: Moon, text: 'Sleep Apnea', path: '/sleep-apnea' },
    { icon: Waves, text: 'Respiratory Health', path: '/respiratory' },
    { icon: Stethoscope, text: 'Hypertension', path: '/hypertension' },
    { icon: Apple, text: 'Diet & Fitness', path: '/diet-fitness' },
    { icon: MessageSquare, text: 'MED AI Chat', path: '/chat' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-indigo-900 text-white p-4 fixed left-0 top-0 overflow-y-auto flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Activity className="w-8 h-8" />
        <h1 className="text-xl font-bold">Health Buddy</h1>
      </div>
      
      <nav className="space-y-2 flex-grow">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-700 text-white'
                  : 'hover:bg-indigo-800 text-gray-300'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-800 text-gray-300 mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;