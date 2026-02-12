import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Bell, Lock, User, Globe, Moon, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    appointmentReminders: true,
    testResults: false
  });
  
  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    usageAnalytics: true
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  // Toggle component
  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark ${
        enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-sidebar-border'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-y-auto bg-background-dark">
        <div className="w-full px-6 py-8 md:px-10 lg:px-16 lg:py-10 max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Settings
            </h1>
            <p className="text-muted">
              Customize your MediAI experience and preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Notifications Section */}
            <div className="bg-card-dark rounded-xl p-6 border border-sidebar-border">
              <h2 className="text-xl font-bold text-white mb-6">
                Notifications
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-white font-medium">Medication Reminders</h3>
                    <p className="text-muted text-sm">Get notified when it's time to take your medications</p>
                  </div>
                  <Toggle 
                    enabled={notifications.medicationReminders}
                    onChange={() => handleNotificationChange('medicationReminders')}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-white font-medium">Appointment Reminders</h3>
                    <p className="text-muted text-sm">Receive alerts about upcoming appointments</p>
                  </div>
                  <Toggle 
                    enabled={notifications.appointmentReminders}
                    onChange={() => handleNotificationChange('appointmentReminders')}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-white font-medium">Test Results</h3>
                    <p className="text-muted text-sm">Get notified when test results are available</p>
                  </div>
                  <Toggle 
                    enabled={notifications.testResults}
                    onChange={() => handleNotificationChange('testResults')}
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Data Section */}
            <div className="bg-card-dark rounded-xl p-6 border border-sidebar-border">
              <h2 className="text-xl font-bold text-white mb-6">
                Privacy & Data
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-white font-medium">Data Sharing</h3>
                    <p className="text-muted text-sm">Allow anonymous data sharing for research</p>
                  </div>
                  <Toggle 
                    enabled={privacy.dataSharing}
                    onChange={() => handlePrivacyChange('dataSharing')}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-white font-medium">Usage Analytics</h3>
                    <p className="text-muted text-sm">Help improve the app with usage data</p>
                  </div>
                  <Toggle 
                    enabled={privacy.usageAnalytics}
                    onChange={() => handlePrivacyChange('usageAnalytics')}
                  />
                </div>
              </div>
            </div>

            {/* Account Management Section */}
            <div className="bg-card-dark rounded-xl p-6 border border-sidebar-border">
              <h2 className="text-xl font-bold text-white mb-6">
                Account Management
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-white font-medium">Change Password</h3>
                    <p className="text-muted text-sm">Update your account password</p>
                  </div>
                  <button className="px-4 py-2 bg-sidebar-hover hover:bg-sidebar-border text-white rounded-lg font-medium transition-colors">
                    Change
                  </button>
                </div>
                
                <div className="border-t border-sidebar-border pt-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-white font-medium">Sign Out</h3>
                      <p className="text-muted text-sm">Sign out of your MediAI account</p>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
