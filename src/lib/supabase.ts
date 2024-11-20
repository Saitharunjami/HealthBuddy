import { createClient } from '@supabase/supabase-js';

// Default values for development - replace with your Supabase project details
const SUPABASE_URL = 'https://gmhvexkhbyzkcmvnflpr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHZleGtoYnl6a2Ntdm5mbHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0NTEwNDksImV4cCI6MjA0NjAyNzA0OX0.ICcsl7xzlT_6eictZhL75iGnztfFKBW0q8VMNAtjAQs';

// Get environment variables with fallback to default values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || SUPABASE_KEY;

// Validate URL format
const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

if (!isValidUrl(supabaseUrl)) {
  throw new Error('Invalid Supabase URL format');
}

if (!supabaseKey) {
  throw new Error('Supabase anon key is required');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  height: number;
  weight: number;
  medical_conditions: string[];
  medications: string[];
  emergency_contact: string;
  created_at: string;
  updated_at: string;
};

export type HealthMetrics = {
  id?: string;
  user_id: string;
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  bmi: number;
  sleep_hours: number;
  created_at?: string;
};

export type AuthError = {
  message: string;
  status?: number;
};

export const handleAuthError = (error: any): AuthError => {
  if (error?.message) {
    return {
      message: error.message,
      status: error?.status || 500
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500
  };
};

export const getProfile = async (): Promise<{ data: Profile | null; error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateProfile = async (profile: Partial<Profile>): Promise<{ error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const updates = {
      id: user.id,
      updated_at: new Date().toISOString(),
      ...profile
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getLatestHealthMetrics = async (): Promise<{ data: HealthMetrics | null; error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { 
      data: data || {
        user_id: user.id,
        heart_rate: 72,
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        bmi: 22.5,
        sleep_hours: 7.5,
      }, 
      error: null 
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateHealthMetrics = async (metrics: Partial<HealthMetrics>): Promise<{ error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const updates = {
      user_id: user.id,
      heart_rate: metrics.heart_rate,
      blood_pressure_systolic: metrics.blood_pressure_systolic,
      blood_pressure_diastolic: metrics.blood_pressure_diastolic,
      bmi: metrics.bmi,
      sleep_hours: metrics.sleep_hours,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('health_metrics')
      .insert([updates]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};