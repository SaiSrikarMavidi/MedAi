import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Pill,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  BedDouble,
  CheckCircle,
  Clock,
  ShoppingCart,
  MessageCircle,
  Package,
  X,
  Plus,
  Calendar,
  Clock4,
  AlertCircle,
} from 'lucide-react';
import ChatLayout from '../components/ChatLayout';
import { medicineAPI } from '../services/api';

const TIME_PERIODS = [
  {
    id: 'morning',
    label: 'Morning',
    range: '8:00 AM - 12:00 PM',
    icon: Sun,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    borderBg: 'border-white dark:border-background-dark',
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    range: '12:00 PM - 5:00 PM',
    icon: Sunset,
    iconBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    borderBg: 'border-white dark:border-background-dark',
  },
  {
    id: 'evening',
    label: 'Evening',
    range: '5:00 PM - 9:00 PM',
    icon: Moon,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    borderBg: 'border-white dark:border-background-dark',
  },
  {
    id: 'night',
    label: 'Night',
    range: '9:00 PM - 8:00 AM',
    icon: BedDouble,
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    borderBg: 'border-white dark:border-background-dark',
  },
];

function ScheduleTimeline({ medicines, onAddMedicine, onMarkTaken, loading }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const formatSelectedDate = () => {
    const today = new Date();
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `+${diffDays} days`;
    return `${diffDays} days`;
  };

  // Filter medicines for the selected date
  const getTodayMedicines = () => {
    const today = selectedDate.toISOString().split('T')[0];
    return medicines.filter(medicine => {
      const startDate = new Date(medicine.startDate).toISOString().split('T')[0];
      const endDate = medicine.endDate ? new Date(medicine.endDate).toISOString().split('T')[0] : null;
      
      return startDate <= today && (!endDate || endDate >= today);
    });
  };

  const getMedicinesForPeriod = (periodId) => {
    const todayMedicines = getTodayMedicines();
    return todayMedicines.filter(medicine => {
      return medicine.timings.some(timing => {
        const hour = parseInt(timing.time.split(':')[0]);
        if (periodId === 'morning' && hour >= 6 && hour < 12) return true;
        if (periodId === 'afternoon' && hour >= 12 && hour < 17) return true;
        if (periodId === 'evening' && hour >= 17 && hour < 21) return true;
        if (periodId === 'night' && (hour >= 21 || hour < 6)) return true;
        return false;
      });
    });
  };

  if (loading) {
    return (
      <div className="lg:col-span-2 space-y-10">
        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border shadow-sm p-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-10">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Medicine Schedule
          </h1>
          <p className="text-muted text-base font-medium leading-relaxed">
            Track your daily medication routine
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onAddMedicine}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>
      </header>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border shadow-sm p-4">
        <button 
          onClick={() => navigateDate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-sidebar-hover text-neutral-500 dark:text-gray-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold px-2 text-gray-900 dark:text-white">{formatSelectedDate()}</span>
        </div>
        <button 
          onClick={() => navigateDate(1)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-sidebar-hover text-neutral-500 dark:text-gray-400 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline */}
      {!medicines.length ? (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border shadow-sm p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Pill className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No Medications Scheduled</h3>
            <p className="text-muted text-sm max-w-md leading-relaxed">
              Add your medications to start tracking your daily schedule and medication adherence.
            </p>
            <button 
              onClick={onAddMedicine}
              className="mt-6 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform"
            >
              Add Medication
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {TIME_PERIODS.map((period) => {
            const periodMedicines = getMedicinesForPeriod(period.id);
            
            return (
              <div key={period.id} className="bg-white dark:bg-card-dark rounded-xl border border-neutral-200 dark:border-sidebar-border shadow-sm">
                <div className={`p-6 border-b border-neutral-200 dark:border-sidebar-border ${period.borderBg}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${period.iconBg} flex items-center justify-center`}>
                      <period.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">{period.label}</h3>
                      <p className="text-muted text-sm">{period.range}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs text-muted bg-neutral-100 dark:bg-sidebar-hover px-2 py-1 rounded">
                        {periodMedicines.length} {periodMedicines.length === 1 ? 'medicine' : 'medicines'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {periodMedicines.length > 0 ? (
                  <div className="p-6 space-y-4">
                    {periodMedicines.map((medicine) => (
                      medicine.timings
                        .filter(timing => {
                          const hour = parseInt(timing.time.split(':')[0]);
                          if (period.id === 'morning' && hour >= 6 && hour < 12) return true;
                          if (period.id === 'afternoon' && hour >= 12 && hour < 17) return true;
                          if (period.id === 'evening' && hour >= 17 && hour < 21) return true;
                          if (period.id === 'night' && (hour >= 21 || hour < 6)) return true;
                          return false;
                        })
                        .map((timing, timingIndex) => (
                          <div key={`${medicine._id}-${timingIndex}`} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-background-dark rounded-lg">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{medicine.name}</h4>
                              <p className="text-muted text-sm">{medicine.dosage}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock4 className="w-3 h-3 text-muted" />
                                <span className="text-xs text-muted">{timing.time}</span>
                                {medicine.instructions && (
                                  <span className="text-xs text-muted">• {medicine.instructions}</span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => onMarkTaken(medicine._id, timingIndex)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                timing.taken
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                  : 'bg-primary text-white hover:bg-blue-600'
                              }`}
                              disabled={timing.taken}
                            >
                              {timing.taken ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Taken
                                </div>
                              ) : (
                                'Mark as Taken'
                              )}
                            </button>
                          </div>
                        ))
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted text-sm">No medicines scheduled for this time period</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdherenceScoreCard({ medicines = [] }) {
  const calculateAdherenceScore = () => {
    if (!medicines.length) return 0;
    
    const totalDoses = medicines.reduce((acc, medicine) => acc + medicine.timings.length, 0);
    const takenDoses = medicines.reduce((acc, medicine) => 
      acc + medicine.timings.filter(timing => timing.taken).length, 0
    );
    
    return totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
  };

  const adherenceScore = calculateAdherenceScore();
  const scoreColor = adherenceScore >= 80 ? 'text-green-400' : adherenceScore >= 60 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = adherenceScore >= 80 ? 'bg-green-900/20' : adherenceScore >= 60 ? 'bg-yellow-900/20' : 'bg-red-900/20';

  return (
    <div className="bg-card-dark rounded-xl border border-sidebar-border shadow-sm p-6">
      <h3 className="font-bold text-white mb-2">Adherence Score</h3>
      <p className="text-xs text-gray-400 mb-6">Weekly medication tracking</p>
      
      {medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 rounded-full bg-sidebar-hover flex items-center justify-center mb-4">
            <Pill className="w-10 h-10 text-muted" />
          </div>
          <p className="text-white text-sm font-semibold">No Data Yet</p>
          <p className="text-gray-400 text-xs text-center mt-2 max-w-[200px]">
            Start tracking your medications to see your adherence score
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className={`w-24 h-24 rounded-full ${scoreBg} border-4 border-gray-600 flex items-center justify-center relative`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${scoreColor}`}>{adherenceScore}%</div>
                <div className="text-xs text-gray-400">Score</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Medicines</span>
              <span className="text-white font-medium">{medicines.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">This Week</span>
              <span className="text-green-400 font-medium">
                {medicines.reduce((acc, med) => acc + med.timings.filter(t => t.taken).length, 0)} taken
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UpcomingRefillsCard({ medicines = [], navigateToPharmacy }) {
  const getRefillNeeded = () => {
    if (!medicines.length) return [];
    
    return medicines.filter(medicine => {
      if (!medicine.endDate) return false;
      
      const endDate = new Date(medicine.endDate);
      const today = new Date();
      const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      
      return daysUntilEnd <= 7 && daysUntilEnd >= 0;
    });
  };

  const refillNeeded = getRefillNeeded();

  return (
    <div className="bg-card-dark rounded-xl border border-sidebar-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Upcoming Refills</h3>
        <button 
          onClick={navigateToPharmacy}
          className="text-xs text-primary hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
        >
          <ShoppingCart className="w-3 h-3" />
          Order
        </button>
      </div>
      
      {refillNeeded.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-sidebar-hover flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted" />
          </div>
          <p className="text-white text-sm font-semibold">No Refills Needed</p>
          <p className="text-gray-400 text-xs text-center mt-2 max-w-[200px]">
            Your refill information will appear here
          </p>
          <button 
            onClick={navigateToPharmacy}
            className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-xs font-medium flex items-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            Browse Pharmacy
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {refillNeeded.slice(0, 3).map(medicine => {
            const endDate = new Date(medicine.endDate);
            const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={medicine._id} className="p-3 bg-background-dark rounded-lg border border-sidebar-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{medicine.name}</p>
                    <p className="text-gray-400 text-xs">{medicine.dosage}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${daysLeft <= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={navigateToPharmacy}
            className="w-full py-2 mt-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Order Refills
          </button>
        </div>
      )}
    </div>
  );
}

function NeedAssistanceCard() {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
      <MessageCircle className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rotate-12" />
      <h3 className="font-bold text-lg mb-2 relative z-10">Need Assistance?</h3>
      <p className="text-blue-100 text-sm mb-4 relative z-10">
        Our AI assistant can help you reschedule doses or answer medication questions.
      </p>
      <Link
        to="/dashboard?section=consultations"
        className="relative z-10 inline-flex bg-white text-primary text-sm font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
      >
        Chat with MediAI
      </Link>
    </div>
  );
}

// Add Medication Modal Component
function AddMedicationModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once_daily',
    timings: ['09:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    reminderEnabled: true,
  });
  const [loading, setLoading] = useState(false);

  const frequencyOptions = [
    { value: 'once_daily', label: 'Once Daily', timings: ['09:00'] },
    { value: 'twice_daily', label: 'Twice Daily', timings: ['09:00', '21:00'] },
    { value: 'three_times_daily', label: 'Three Times Daily', timings: ['09:00', '14:00', '21:00'] },
    { value: 'four_times_daily', label: 'Four Times Daily', timings: ['09:00', '14:00', '18:00', '21:00'] },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      if (field === 'frequency') {
        const selectedOption = frequencyOptions.find(opt => opt.value === value);
        return {
          ...prev,
          [field]: value,
          timings: selectedOption ? selectedOption.timings : prev.timings
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const medicineData = {
        ...formData,
        timings: formData.timings.map(time => ({ time, taken: false }))
      };
      
      await medicineAPI.addMedicine(medicineData);
      onAdd(); // Refresh the medicine list
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        dosage: '',
        frequency: 'once_daily',
        timings: ['09:00'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        instructions: '',
        reminderEnabled: true,
      });
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-sidebar-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Medication</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Aspirin, Lisinopril"
              className="w-full px-3 py-2 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dosage *
            </label>
            <input
              type="text"
              required
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              placeholder="e.g. 10 mg, 1 tablet"
              className="w-full px-3 py-2 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency *
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              placeholder="e.g. Take with food, Take before meals"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reminderEnabled"
              checked={formData.reminderEnabled}
              onChange={(e) => handleInputChange('reminderEnabled', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 dark:border-sidebar-border rounded focus:ring-primary"
            />
            <label htmlFor="reminderEnabled" className="text-sm text-gray-700 dark:text-gray-300">
              Enable reminder notifications
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-sidebar-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-sidebar-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MedicineReminder() {
  const navigate = useNavigate();
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineAPI.getMedicines();
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setShowAddMedicationModal(true);
  };

  const handleMedicationAdded = () => {
    fetchMedicines(); // Refresh the list
  };

  const navigateToPharmacy = () => {
    navigate('/dashboard?section=pharmacy');
  };

  const handleMarkAsTaken = async (medicineId, timingIndex) => {
    try {
      await medicineAPI.markAsTaken(medicineId, { timingIndex, timestamp: new Date().toISOString() });
      fetchMedicines(); // Refresh to show updated status
    } catch (error) {
      console.error('Error marking medicine as taken:', error);
      alert('Failed to mark medicine as taken. Please try again.');
    }
  };

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ScheduleTimeline 
              medicines={medicines}
              onAddMedicine={handleAddMedication}
              onMarkTaken={handleMarkAsTaken}
              loading={loading}
            />
            <div className="space-y-6">
              <AdherenceScoreCard medicines={medicines} />
              <UpcomingRefillsCard medicines={medicines} navigateToPharmacy={navigateToPharmacy} />
              <NeedAssistanceCard />
            </div>
          </div>
        </main>
        
        <AddMedicationModal 
          isOpen={showAddMedicationModal}
          onClose={() => setShowAddMedicationModal(false)}
          onAdd={handleMedicationAdded}
        />
      </div>
    </ChatLayout>
  );
}
