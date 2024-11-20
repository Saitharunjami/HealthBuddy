import React, { useState } from 'react';
import { Apple } from 'lucide-react';

const DietFitness = () => {
  const [formData, setFormData] = useState({
    dietType: '',
    mealsPerDay: '',
    waterIntake: '',
    exerciseFrequency: '',
    exerciseType: '',
    exerciseDuration: '',
    sleepHours: '',
    goals: '',
    restrictions: '',
    supplements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Apple className="w-8 h-8 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Diet & Fitness Assessment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Diet Type</label>
              <select
                value={formData.dietType}
                onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select diet type</option>
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Ketogenic</option>
                <option value="paleo">Paleo</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meals per Day</label>
              <select
                value={formData.mealsPerDay}
                onChange={(e) => setFormData({ ...formData, mealsPerDay: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="2">2 meals</option>
                <option value="3">3 meals</option>
                <option value="4">4 meals</option>
                <option value="5">5+ meals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Water Intake (Liters)</label>
              <input
                type="number"
                value={formData.waterIntake}
                onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter water intake"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Frequency</label>
              <select
                value={formData.exerciseFrequency}
                onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="rarely">1-2 times/month</option>
                <option value="sometimes">1-2 times/week</option>
                <option value="regular">3-4 times/week</option>
                <option value="active">5+ times/week</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Type</label>
              <select
                value={formData.exerciseType}
                onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength Training</option>
                <option value="flexibility">Flexibility/Yoga</option>
                <option value="sports">Sports</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Duration (minutes)</label>
              <input
                type="number"
                value={formData.exerciseDuration}
                onChange={(e) => setFormData({ ...formData, exerciseDuration: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter duration"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
              <input
                type="number"
                value={formData.sleepHours}
                onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter sleep hours"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goals</label>
              <select
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="health">General Health</option>
                <option value="performance">Athletic Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
              <select
                value={formData.restrictions}
                onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select restrictions</option>
                <option value="none">None</option>
                <option value="gluten">Gluten-Free</option>
                <option value="lactose">Lactose-Free</option>
                <option value="nuts">Nut-Free</option>
                <option value="multiple">Multiple Restrictions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplements</label>
              <select
                value={formData.supplements}
                onChange={(e) => setFormData({ ...formData, supplements: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select supplement use</option>
                <option value="none">None</option>
                <option value="vitamins">Vitamins/Minerals</option>
                <option value="protein">Protein Supplements</option>
                <option value="both">Both</option>
                <option value="other">Other</option>
              </select>
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

export default DietFitness;