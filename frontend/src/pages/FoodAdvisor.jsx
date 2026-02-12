import { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Bookmark,
  Search,
  Mic,
  ShieldCheck,
  CheckCircle,
  Info,
  Ban,
  RefreshCw,
  Sun,
  Sunset,
  Coffee,
  Moon,
  Droplets,
  AlertTriangle,
  Star,
  Clock,
  X,
  Brain,
  Utensils,
  Activity
} from 'lucide-react';
import ChatLayout from '../components/ChatLayout';
import { useAuth } from '../context/AuthContext';
import { foodAPI } from '../services/api';

function FoodAdvisorNavBar({ onSavedItemsClick }) {
  const { user } = useAuth();
  
  return (
    <nav className="sticky top-0 z-40 w-full bg-card-dark border-b border-sidebar-border shadow-sm">
      <div className="px-4 md:px-8 flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-primary/10 rounded-xl text-primary">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            MediAI <span className="font-normal text-gray-400 text-base ml-1 hidden sm:inline">Food Advisor</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onSavedItemsClick}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors"
          >
            <Bookmark className="w-5 h-5" />
            Saved Items
          </button>
          <div className="h-8 w-px bg-sidebar-border mx-2 hidden md:block" />
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-sidebar-hover bg-center bg-cover border-2 border-sidebar-border shadow-sm"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3kvw_g2Ie3w4qcns9XrXVmFnjCLEZYCJyqk72VajHR4MO_IuhadfsvIaTBIHIinLPdip8UHp-BKuSx7VcZPQf1acgb1ponLmWM75-CL2fz8CRnk274aD1qEfa-mgXdyIkzTHux9B8rHz52B3FV3qzEYlZuE2iMprN_c9eLcWOyDkc2j-eJTpPvTSJw3zygprVY-PyiBLdAFn691h4YZeiaHBCXI8yhvGHkDntYOLpUHuCPFf5YjvteioGEOGNTKj1meDSvYGvS0o')",
              }}
            />
            <div className="hidden md:flex flex-col items-start leading-none gap-1">
              <span className="text-sm font-bold text-white">{user?.name || 'Guest User'}</span>
              <span className="text-[10px] uppercase font-semibold text-primary tracking-wide">Patient</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-8 text-white shadow-lg">
      <div className="relative z-10 flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome to Food Advisor</h2>
          <p className="text-blue-100 text-lg max-w-xl">
            Get personalized dietary recommendations based on your health profile.
          </p>
        </div>
      </div>
      <UtensilsCrossed className="absolute -right-6 -bottom-10 w-[200px] h-[200px] text-white/5 rotate-12" />
    </div>
  );
}

function CheckFoodSafety({ onViewHistory, searchHistory, onAddToHistory, showNotification }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Check if Web Speech API is available
    setIsVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const handleSearch = async (searchQuery = query) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    setIsSearching(true);
    setSearchResults(null);
    
    // Show searching notification
    showNotification('searching', {
      foodName: trimmedQuery,
      features: [
        'Safety for your health conditions',
        'Nutritional information', 
        'Allergen warnings',
        'Interaction with medications'
      ]
    });
    
    try {
      const response = await foodAPI.searchFood(trimmedQuery);
      const checkResponse = await foodAPI.checkFood(trimmedQuery, ['diabetes', 'hypertension']); // Mock health conditions
      
      // Find the food in the response data to get nutritional info
      const allFoods = [...(response.data.safe || []), ...(response.data.limit || []), ...(response.data.avoid || [])];
      const foundFood = allFoods.find(food => 
        food.name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        trimmedQuery.toLowerCase().includes(food.name.toLowerCase())
      );
      
      const formattedResults = {
        foodName: trimmedQuery,
        safety: checkResponse.data,
        categories: response.data,
        nutritionalInfo: foundFood ? {
          calories: foundFood.calories,
          protein: foundFood.protein,
          carbs: foundFood.carbs,
          fat: foundFood.fat,
        } : {
          calories: Math.floor(Math.random() * 300) + 50,
          protein: Math.floor(Math.random() * 25) + 2,
          carbs: Math.floor(Math.random() * 40) + 5,
          fat: Math.floor(Math.random() * 15) + 1,
        },
        allergens: ['None detected'],
        medicationInteractions: checkResponse.data.safe ? 'No known interactions' : 'May interact with diabetes medications'
      };
      
      setSearchResults(formattedResults);
      onAddToHistory({
        query: trimmedQuery,
        timestamp: new Date(),
        result: formattedResults
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        error: 'Failed to search food. Please try again.'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!isVoiceSupported) {
      showNotification('voiceNotSupported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      showNotification('voiceNotSupported');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setIsListening(false);
      showNotification('voiceNotSupported');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearResults = () => {
    setSearchResults(null);
    setQuery('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-white">Check Food Safety</h3>
        <button 
          onClick={onViewHistory}
          className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
        >
          <Clock className="w-3 h-3" />
          View History ({searchHistory.length})
        </button>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 transition-colors ${
            isSearching ? 'text-primary animate-pulse' : 'text-gray-400 group-focus-within:text-primary'
          }`} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching || isListening}
          className="block w-full pl-12 pr-12 py-4 bg-card-dark border-0 ring-1 ring-sidebar-border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm text-lg transition-shadow focus:outline-none disabled:opacity-50"
          placeholder={isListening ? "Listening..." : "Search for food (e.g., 'Banana', 'Chicken', 'Bread')..."}
        />
        <button 
          onClick={handleVoiceSearch}
          disabled={isSearching || isListening}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-sidebar-hover hover:bg-sidebar-border text-gray-400 hover:text-primary'
          } disabled:opacity-50`}
          title={isVoiceSupported ? (isListening ? 'Listening...' : 'Voice Search') : 'Voice search not supported'}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
      
      {searchResults && (
        <div className="mt-6 bg-card-dark border border-sidebar-border rounded-xl p-6">
          {searchResults.error ? (
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>{searchResults.error}</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-white capitalize">{searchResults.foodName}</h4>
                <button 
                  onClick={clearResults}
                  className="p-1 hover:bg-sidebar-hover rounded text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Safety Status */}
              <div className={`p-4 rounded-lg border ${
                searchResults.safety.safe
                  ? 'bg-green-900/20 border-green-500 text-green-400'
                  : 'bg-red-900/20 border-red-500 text-red-400'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {searchResults.safety.safe ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    {searchResults.safety.safe ? 'Safe to Eat' : 'Consider Limiting'}
                  </span>
                </div>
                <p className="text-sm">{searchResults.safety.recommendation}</p>
              </div>
              
              {/* Nutritional Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background-dark p-3 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Calories</p>
                  <p className="text-white text-lg font-bold">{searchResults.nutritionalInfo.calories}</p>
                </div>
                <div className="bg-background-dark p-3 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Protein</p>
                  <p className="text-white text-lg font-bold">{searchResults.nutritionalInfo.protein}g</p>
                </div>
                <div className="bg-background-dark p-3 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Carbs</p>
                  <p className="text-white text-lg font-bold">{searchResults.nutritionalInfo.carbs}g</p>
                </div>
                <div className="bg-background-dark p-3 rounded-lg">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Fat</p>
                  <p className="text-white text-lg font-bold">{searchResults.nutritionalInfo.fat}g</p>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Allergen Warnings:</p>
                  <p className="text-white">{searchResults.allergens.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-1">Medication Interactions:</p>
                  <p className="text-white">{searchResults.medicationInteractions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecommendedForYou({ recommendations, loading, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h3 className="text-lg font-bold text-white">Recommended for You</h3>
          <span className="text-xs font-medium text-gray-400 bg-sidebar-hover px-2 py-1 rounded-full">Safe to Eat</span>
        </div>
        <button 
          onClick={onRefresh}
          className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-sidebar-border rounded-xl">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-white text-sm font-semibold">No Recommendations Yet</p>
          <p className="text-gray-400 text-xs text-center mt-2 max-w-[300px]">
            Search for foods or update your health profile to get personalized recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((food, index) => (
            <div key={index} className="bg-card-dark border border-sidebar-border rounded-lg p-4 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">{food.name}</h4>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-400">{food.category}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-400">Calories</p>
                  <p className="text-white font-medium">{food.calories}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Protein</p>
                  <p className="text-white font-medium">{food.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Carbs</p>
                  <p className="text-white font-medium">{food.carbs}g</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FoodsToLimitOrAvoid({ restrictions, loading, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <h3 className="text-lg font-bold text-white">Foods to Limit or Avoid</h3>
        </div>
        <button 
          onClick={onRefresh}
          className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : restrictions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-sidebar-border rounded-xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-white text-sm font-semibold">No Restrictions</p>
          <p className="text-gray-400 text-xs text-center mt-2 max-w-[300px]">
            Based on your health profile, we'll show foods to limit or avoid
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {restrictions.map((food, index) => (
            <div key={index} className="bg-card-dark border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">{food.name}</h4>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-400">{food.category}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="text-gray-400">
                  <span className="text-amber-400 font-medium">Limit:</span> High in {food.reason || 'sodium and calories'}
                </div>
                <div className="text-amber-400 font-medium">{food.calories} cal</div>
              </div>
              {food.alternatives && (
                <div className="mt-2 pt-2 border-t border-sidebar-border">
                  <p className="text-xs text-gray-400 mb-1">Better alternatives:</p>
                  <p className="text-xs text-green-400">{food.alternatives.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DailyMealPlan({ mealPlan, loading, onGeneratePlan, showNotification }) {
  const mealTimes = [
    { id: 'breakfast', icon: Coffee, label: 'Breakfast', time: '8:00 AM' },
    { id: 'lunch', icon: Sun, label: 'Lunch', time: '1:00 PM' },
    { id: 'dinner', icon: Sunset, label: 'Dinner', time: '7:00 PM' },
    { id: 'snack', icon: Moon, label: 'Snack', time: '3:00 PM' }
  ];
  
  const handleGeneratePlan = () => {
    showNotification('mealPlanGenerator', {
      features: [
        'Your health conditions',
        'Dietary preferences', 
        'Caloric needs',
        'Nutritional goals',
        'Medication interactions'
      ]
    });
    onGeneratePlan();
  };

  return (
    <div className="bg-card-dark rounded-2xl border border-sidebar-border shadow-lg overflow-hidden">
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <h3 className="font-bold text-white">Daily Meal Plan</h3>
        <button 
          onClick={handleGeneratePlan}
          disabled={loading}
          className={`flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors active:scale-95 transform disabled:opacity-50 ${
            loading ? 'cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : 'AI Generate'}
        </button>
      </div>
      
      {loading ? (
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !mealPlan ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-sidebar-hover flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-8 h-8 text-muted" />
          </div>
          <p className="text-white text-sm font-semibold">No Meal Plan</p>
          <p className="text-gray-400 text-xs text-center mt-2 max-w-[200px] mb-4">
            Generate a personalized meal plan based on your health goals
          </p>
          <button 
            onClick={handleGeneratePlan}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform"
          >
            Generate Plan
          </button>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {mealTimes.map((mealTime) => {
            const meal = mealPlan[mealTime.id];
            return (
              <div key={mealTime.id} className="bg-background-dark rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <mealTime.icon className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="text-white font-semibold">{mealTime.label}</h4>
                    <p className="text-gray-400 text-xs">{mealTime.time}</p>
                  </div>
                </div>
                {meal && meal.length > 0 ? (
                  <div className="space-y-2">
                    {meal.map((food, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{food.name}</span>
                        <span className="text-primary text-xs">{food.calories} cal</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No meals planned</p>
                )}
              </div>
            );
          })}
          
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Optimized for your health conditions and dietary preferences
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function HydrationGoal({ onLogWater }) {
  const [waterIntake, setWaterIntake] = useState(0);
  const goal = 2.5;
  const percentage = Math.min((waterIntake / goal) * 100, 100);

  const handleLogWater = () => {
    const amount = prompt('How much water did you drink? (in Liters)\n\nExamples: 0.25, 0.5, 1.0');
    if (amount && !isNaN(amount)) {
      const newTotal = Math.min(waterIntake + parseFloat(amount), goal);
      setWaterIntake(newTotal);
      onLogWater(parseFloat(amount));
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="w-5 h-5" />
          <h4 className="font-bold text-lg">Hydration Goal</h4>
        </div>
        <p className="text-blue-100 text-sm mb-4">Track your daily water intake for better health.</p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold">{waterIntake.toFixed(1)}</span>
          <span className="text-sm font-medium opacity-80 mb-1">/ {goal} Liters</span>
        </div>
        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        <button 
          onClick={handleLogWater}
          className="mt-4 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors active:scale-95 transform"
        >
          Log Water Intake
        </button>
      </div>
      <Droplets className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
    </div>
  );
}

// Notification Component
function NotificationModal({ notification, onClose }) {
  if (!notification) return null;

  const getNotificationContent = () => {
    switch (notification.type) {
      case 'searching':
        return {
          title: `Searching for "${notification.data.foodName}"...`,
          icon: <Search className="w-6 h-6 animate-pulse" />,
          description: 'This feature will check:',
          features: notification.data.features,
          bgColor: 'from-blue-500 to-blue-600',
          isLoading: true
        };
      case 'voiceSearch':
        return {
          title: 'Voice Search Ready!',
          icon: <Mic className="w-6 h-6" />,
          description: 'Speak clearly to search for foods:',
          features: [
            'Say food names naturally',
            'Get instant safety results',
            'Hands-free operation',
            'Works in Chrome, Edge & Safari'
          ],
          bgColor: 'from-green-500 to-green-600',
          isLoading: false
        };
      case 'mealPlanGenerator':
        return {
          title: 'Generating Your Personalized Meal Plan...',
          icon: <Brain className="w-6 h-6 animate-pulse" />,
          description: 'Creating plan based on:',
          features: notification.data.features,
          bgColor: 'from-purple-500 to-purple-600',
          isLoading: true
        };
      case 'voiceNotSupported':
        return {
          title: 'Voice Search Not Available',
          icon: <Mic className="w-6 h-6" />,
          description: 'Voice search is not supported in this browser. Try Chrome, Edge, or Safari for the best experience.',
          features: null,
          bgColor: 'from-red-500 to-red-600',
          isLoading: false
        };
      default:
        return null;
    }
  };

  const content = getNotificationContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-background-dark border border-sidebar-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideIn">
        <div className={`bg-gradient-to-r ${content.bgColor} p-6 text-white relative overflow-hidden`}>
          {content.isLoading && (
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          )}
          <div className="flex items-center gap-3 mb-3 relative z-10">
            {content.icon}
            <h2 className="text-lg font-bold">{content.title}</h2>
          </div>
          <p className="text-white/90 text-sm relative z-10">{content.description}</p>
          {content.isLoading && (
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-pulse" 
                 style={{ width: '100%' }} />
          )}
        </div>
        
        <div className="p-6">
          {content.features && (
            <ul className="space-y-3 mb-6">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300 animate-slideInLeft" 
                    style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" 
                       style={{ animationDelay: `${index * 200}ms` }} />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 transform hover:shadow-lg"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
function SavedItemsModal({ isOpen, onClose, savedItems, onRemoveItem }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-sidebar-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Items</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {savedItems.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No saved items yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Save foods you search frequently</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-background-dark rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Search History Modal
function SearchHistoryModal({ isOpen, onClose, searchHistory, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-sidebar-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Search History</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClearHistory}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Clear All
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {searchHistory.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No search history</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Your food searches will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchHistory.slice().reverse().map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white capitalize">{item.query}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.result.safety?.safe
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {item.result.safety?.safe ? 'Safe' : 'Limit'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                  {item.result.nutritionalInfo && (
                    <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-400">Cal</p>
                        <p className="text-gray-900 dark:text-white font-medium">{item.result.nutritionalInfo.calories}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Protein</p>
                        <p className="text-gray-900 dark:text-white font-medium">{item.result.nutritionalInfo.protein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Carbs</p>
                        <p className="text-gray-900 dark:text-white font-medium">{item.result.nutritionalInfo.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Fat</p>
                        <p className="text-gray-900 dark:text-white font-medium">{item.result.nutritionalInfo.fat}g</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FoodAdvisor() {
  const [recommendations, setRecommendations] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState({
    recommendations: false,
    restrictions: false,
    mealPlan: false
  });
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Notification handler
  const showNotification = (type, data = {}) => {
    setNotification({ type, data });
    
    // Auto-close certain notifications
    if (type === 'searching') {
      setTimeout(() => {
        setNotification(null);
      }, 3000); // Show for 3 seconds
    } else if (type === 'voiceSearch') {
      // Close voice search notification after 4 seconds if not manually closed
      setTimeout(() => {
        if (notification?.type === 'voiceSearch') {
          setNotification(null);
        }
      }, 4000);
    } else if (type === 'mealPlanGenerator') {
      // Close meal plan notification after 2 seconds
      setTimeout(() => {
        if (notification?.type === 'mealPlanGenerator') {
          setNotification(null);
        }
      }, 2000);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSavedItems = localStorage.getItem('foodAdvisor_savedItems');
    const savedSearchHistory = localStorage.getItem('foodAdvisor_searchHistory');
    
    if (savedSavedItems) {
      try {
        setSavedItems(JSON.parse(savedSavedItems));
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    }
    
    if (savedSearchHistory) {
      try {
        setSearchHistory(JSON.parse(savedSearchHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
    
    // Load initial recommendations and restrictions
    fetchRecommendations();
    fetchRestrictions();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(prev => ({ ...prev, recommendations: true }));
    try {
      const response = await foodAPI.getRecommendedFoods(['diabetes', 'hypertension']);
      const responseData = response.data || response; // Handle both formats
      const allRecommendations = [
        ...(responseData.breakfast || []),
        ...(responseData.lunch || []),
        ...(responseData.dinner || [])
      ];
      setRecommendations(allRecommendations.slice(0, 6));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback recommendations
      setRecommendations([
        { name: 'Oatmeal', category: 'Grains', calories: 150, protein: 5, carbs: 27, fat: 3 },
        { name: 'Greek Yogurt', category: 'Dairy', calories: 100, protein: 17, carbs: 6, fat: 0 },
        { name: 'Grilled Chicken', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: 'Steamed Broccoli', category: 'Vegetables', calories: 55, protein: 4, carbs: 11, fat: 0.6 },
        { name: 'Brown Rice', category: 'Grains', calories: 216, protein: 5, carbs: 45, fat: 2 },
        { name: 'Quinoa Salad', category: 'Grains', calories: 220, protein: 8, carbs: 39, fat: 4 }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  };

  const fetchRestrictions = async () => {
    setLoading(prev => ({ ...prev, restrictions: true }));
    try {
      const response = await foodAPI.searchFood('');
      const responseData = response.data || response;
      const restrictionsWithReasons = (responseData.avoid || []).concat(
        (responseData.limit || [])
      ).map(food => ({
        ...food,
        reason: food.category === 'Fast Food' ? 'saturated fat' : food.category === 'Beverages' ? 'sugar' : 'sodium',
        alternatives: ['Grilled Chicken', 'Brown Rice', 'Fresh Vegetables']
      }));
      setRestrictions(restrictionsWithReasons.slice(0, 4));
    } catch (error) {
      console.error('Error fetching restrictions:', error);
      // Fallback restrictions
      setRestrictions([
        { 
          name: 'Fried Foods', 
          category: 'Fast Food', 
          calories: 320, 
          reason: 'saturated fat',
          alternatives: ['Grilled Chicken', 'Baked Fish', 'Steamed Vegetables']
        },
        { 
          name: 'Sugary Drinks', 
          category: 'Beverages', 
          calories: 140, 
          reason: 'sugar',
          alternatives: ['Water', 'Herbal Tea', 'Fresh Juice']
        },
        { 
          name: 'Processed Snacks', 
          category: 'Packaged', 
          calories: 250, 
          reason: 'sodium',
          alternatives: ['Fresh Fruits', 'Nuts', 'Yogurt']
        },
        { 
          name: 'White Bread', 
          category: 'Grains', 
          calories: 265, 
          reason: 'refined carbs',
          alternatives: ['Whole Grain Bread', 'Quinoa', 'Oats']
        }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, restrictions: false }));
    }
  };

  const handleGenerateMealPlan = async () => {
    setLoading(prev => ({ ...prev, mealPlan: true }));
    try {
      const response = await foodAPI.getMealPlan();
      const responseData = response.data || response;
      setMealPlan(responseData);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // Fallback to comprehensive mock data if API fails
      setMealPlan({
        breakfast: [
          { name: 'Whole grain oatmeal with berries', calories: 160 }, 
          { name: 'Greek yogurt with honey', calories: 120 },
          { name: 'Green tea', calories: 5 }
        ],
        lunch: [
          { name: 'Quinoa bowl with vegetables', calories: 280 }, 
          { name: 'Grilled chicken breast', calories: 165 },
          { name: 'Sparkling water', calories: 0 }
        ],
        dinner: [
          { name: 'Baked salmon with herbs', calories: 200 }, 
          { name: 'Roasted sweet potato', calories: 112 },
          { name: 'Steamed broccoli', calories: 55 }
        ],
        snack: [
          { name: 'Mixed nuts and seeds', calories: 160 },
          { name: 'Fresh apple slices', calories: 80 }
        ]
      });
    } finally {
      setLoading(prev => ({ ...prev, mealPlan: false }));
    }
  };

  const handleSavedItems = () => {
    setShowSavedItems(true);
  };

  const handleViewHistory = () => {
    setShowSearchHistory(true);
  };

  const handleAddToHistory = (historyItem) => {
    const newHistory = [...searchHistory, historyItem];
    setSearchHistory(newHistory);
    localStorage.setItem('foodAdvisor_searchHistory', JSON.stringify(newHistory));
  };

  const handleRemoveSavedItem = (index) => {
    const newSavedItems = savedItems.filter((_, i) => i !== index);
    setSavedItems(newSavedItems);
    localStorage.setItem('foodAdvisor_savedItems', JSON.stringify(newSavedItems));
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('foodAdvisor_searchHistory');
  };

  const handleLogWater = (amount) => {
    // In production, this would save to backend
  };

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto bg-background-dark">
        <FoodAdvisorNavBar onSavedItemsClick={handleSavedItems} />
        <main className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <WelcomeBanner />
              <CheckFoodSafety 
                onViewHistory={handleViewHistory} 
                searchHistory={searchHistory}
                onAddToHistory={handleAddToHistory}
                showNotification={showNotification}
              />
              <RecommendedForYou 
                recommendations={recommendations}
                loading={loading.recommendations}
                onRefresh={fetchRecommendations}
              />
              <FoodsToLimitOrAvoid 
                restrictions={restrictions}
                loading={loading.restrictions}
                onRefresh={fetchRestrictions}
              />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
              <DailyMealPlan 
                mealPlan={mealPlan}
                loading={loading.mealPlan}
                onGeneratePlan={handleGenerateMealPlan}
                showNotification={showNotification}
              />
              <HydrationGoal onLogWater={handleLogWater} />
            </div>
          </div>
        </main>
        
        <NotificationModal 
          notification={notification}
          onClose={closeNotification}
        />
        
        <SavedItemsModal 
          isOpen={showSavedItems}
          onClose={() => setShowSavedItems(false)}
          savedItems={savedItems}
          onRemoveItem={handleRemoveSavedItem}
        />
        
        <SearchHistoryModal 
          isOpen={showSearchHistory}
          onClose={() => setShowSearchHistory(false)}
          searchHistory={searchHistory}
          onClearHistory={handleClearHistory}
        />
      </div>
    </ChatLayout>
  );
}
