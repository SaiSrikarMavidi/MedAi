import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Heart, Activity, Weight, Ruler, Droplet, Save, Calendar, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HealthProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    heartRate: '72',
    bloodPressureSystolic: '120',
    bloodPressureDiastolic: '80',
    weight: '70',
    height: '173',
    age: '28',
    bloodType: 'O+',
    allergies: 'Seasonal Allergies',
    chronicConditions: '',
    lastCheckup: '2026-01-27' // 2 weeks ago from Feb 10, 2026
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate BMI
  const calculateBMI = () => {
    const weightKg = parseFloat(formData.weight);
    const heightM = parseFloat(formData.height) / 100;
    if (weightKg && heightM) {
      const bmi = weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return '0.0';
  };

  // Get BMI status
  const getBMIStatus = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  // Convert cm to feet and inches
  const convertHeightToFeet = (cm) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  // Calculate time since last checkup
  const getTimeSinceCheckup = () => {
    const checkupDate = new Date(formData.lastCheckup);
    const today = new Date();
    const diffTime = today - checkupDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 21) return '2 weeks ago';
    if (diffDays < 28) return '3 weeks ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccessMessage('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccessMessage('Health profile updated successfully!');
    setSaving(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            My Health Profile
          </h1>
          <p className="text-neutral-500 dark:text-muted">
            Track and manage your health information
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {/* Save Button */}
        <div className="mb-6 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Main Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Personal Information Card */}
          <div className="bg-white dark:bg-card-dark rounded-xl p-6 border border-neutral-200 dark:border-sidebar-border">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Personal Information
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  Age
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="text-lg font-medium text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none w-16"
                  />
                  <span className="text-neutral-600 dark:text-gray-400">years</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  Height
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-neutral-900 dark:text-white">
                    {convertHeightToFeet(formData.height)}
                  </span>
                  <span className="text-neutral-600 dark:text-gray-400">(</span>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="text-lg font-medium text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none w-16"
                  />
                  <span className="text-neutral-600 dark:text-gray-400">cm)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="text-lg font-medium text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none w-16"
                  />
                  <span className="text-neutral-600 dark:text-gray-400">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  Blood Type
                </label>
                <select 
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="text-lg font-medium text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none w-20"
                >
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Metrics Card */}
          <div className="bg-white dark:bg-card-dark rounded-xl p-6 border border-neutral-200 dark:border-sidebar-border">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Health Metrics
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  BMI
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-neutral-900 dark:text-white">
                    {calculateBMI()}
                  </span>
                  <span className="text-sm text-neutral-600 dark:text-gray-400">
                    ({getBMIStatus(calculateBMI())})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  Blood Pressure
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    name="bloodPressureSystolic"
                    value={formData.bloodPressureSystolic}
                    onChange={handleChange}
                    className="text-lg font-medium text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none w-16"
                  />
                  <span className="text-lg font-medium text-neutral-900 dark:text-white">/</span>
                  <input
                    type="number"
                    name="bloodPressureDiastolic"
                    value={formData.bloodPressureDiastolic}
                    onChange={handleChange}
                    className="text-lg font-medium text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none w-16"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  Heart Rate
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    className="text-lg font-medium text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none w-16"
                  />
                  <span className="text-neutral-600 dark:text-gray-400">bpm</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-1">
                  Last Checkup
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    name="lastCheckup"
                    value={formData.lastCheckup}
                    onChange={handleChange}
                    className="text-sm text-neutral-900 dark:text-white bg-transparent border-b border-neutral-300 dark:border-sidebar-border focus:border-primary focus:outline-none"
                  />
                  <span className="text-sm text-neutral-600 dark:text-gray-400">
                    ({getTimeSinceCheckup()})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Conditions Card */}
          <div className="bg-white dark:bg-card-dark rounded-xl p-6 border border-neutral-200 dark:border-sidebar-border">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Medical Conditions
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-2">
                  Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="Enter allergies"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-sidebar-border bg-white dark:bg-background-dark text-neutral-900 dark:text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-2">
                  Chronic Conditions
                </label>
                <input
                  type="text"
                  name="chronicConditions"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  placeholder="No other conditions"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-sidebar-border bg-white dark:bg-background-dark text-neutral-900 dark:text-white focus:border-primary focus:outline-none"
                />
                {!formData.chronicConditions && (
                  <p className="text-sm text-neutral-500 dark:text-muted mt-1">
                    No other conditions
                  </p>
                )}
              </div>

              <div className="pt-2">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  {formData.allergies && (
                    <div className="inline-flex items-center px-2 py-1 bg-amber-100 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200 text-sm rounded-full">
                      {formData.allergies}
                    </div>
                  )}
                  {!formData.allergies && (
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      No allergies recorded
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
