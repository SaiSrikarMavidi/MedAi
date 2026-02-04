import { useState } from 'react';
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
} from 'lucide-react';
import ChatLayout from '../components/ChatLayout';

const RECOMMENDED_FOODS = [
  {
    name: 'Fresh Spinach',
    category: 'Leafy Green Vegetables',
    tip: 'Rich in magnesium & potassium to naturally lower BP.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKAB1L-fWvkQ1XHwObSYJ6oFlUETv2IoEx2IdFTlMUHA8Gbo1nNm3JoOLSDoOsCzlvsr21WBIa13xR6vgyKi0UsX3hHYv2TbFJyWe-jd5n0CcVFG8stwJbr5Y_fN_qsymXY2JFT1VcyWQYnZDKF-tuPJTvHumZM8toe-VYMiuhjTfprylgL6u03vpAz3NgdTsTCSHP-zZ1SJL0iISzjfWi7cyFFXYZJSuJZWcWM8ads8LB1wyJQwjMUNT8rwdcd897LOMBBRjNPK0',
    badge: 'SAFE',
    badgeColor: 'bg-green-500',
  },
  {
    name: 'Grilled Salmon',
    category: 'Fatty Fish',
    tip: 'Omega-3s reduce inflammation and support heart rhythm.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxjlwlxQjkesL3Y9ExG0-dr7peujvz9Y1EIa4wNm2r2sRrCOHxuFH8Srh4BUL_P5QsmJWkoQwsB6_GLCD4r4yQhh-4HCpAbliVVcicr42D37rsUx6R0aHGsGXMv-7mx79C0GVrRuXZkgtPzR8wPIcNk4NPufd0uNW925PRU0KRjUYfPePJURPo5CVHC3t-CII0zkPIiIwdBoxxKSOl7lSWSoc8l3waWOpWFgipejCY0xkqYmLD1ZWGInjox5g7jyn1GXm2EbDGDJM',
    badge: 'SAFE',
    badgeColor: 'bg-green-500',
  },
];

const LIMIT_AVOID_FOODS = [
  {
    name: 'Salted Nuts',
    tip: 'High sodium. Choose unsalted variants for healthy fats.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1YSaCZWKqXkVGTYFBJ8mvA3L7lmJ28XVzpsZtlfsEUWTF1FlpH88n4rzI-bfgr2EFhPF9Nlu7GtfLYBMmE7YCOvpERbyVnYiQZxMsFTsZyq98YfpkNnEp9FFCelbIoivQd6zipcksoS-XvsTroMbIhcvq10Q_P7OdMlcnxxbIMkBEv_2CZGwn41cKf5WUkH0qJN8kGc1eDEktigMOBjdi-7BFsNTcFt0CC5dbDZgszaeEa9BjarH8zYuFePZHdFC2XOfO8YGNvlI',
    badge: 'LIMIT',
    badgeColor: 'bg-amber-500',
    icon: Info,
    iconColor: 'text-amber-500',
  },
  {
    name: 'Canned Soup',
    tip: 'Extremely high sodium content. Dangerous for BP control.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSFyvcZvj2z7SF4I7CY1rxrMMzylWhBYfifvPDdZmQyHPOQSvxJa3WM-vQdT0Nt0F63PySdh-tcAuyTZrv_-OOS1rmbQR3BZVdtAV4-cVQePSWhUs8Nv2rtuEeDS1xYM2ytvXtAhGNuuywxLtE5O5CUiAJo6u_wp1Y2dmu7UPcJbd4gMym-AhTLHCBkaOU3klS2Rrz9JxwTe-loSn6fES3vJinlkequFgyfrEzrpbuBO3B0SoCKpVscUnwLLQDLbKScI7HHhFwbsA',
    badge: 'AVOID',
    badgeColor: 'bg-red-500',
    icon: Ban,
    iconColor: 'text-red-500',
  },
  {
    name: 'Processed Meats',
    tip: 'Contains preservatives & nitrates that harden arteries.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyT42vwcs1zwPOVjowEQK8PXca1dQT_XPcRdoFz3vvg3sThq1S4oWmoPRAjOke5Ct7AIZrWRJmsdoVndVo4ccB5bMUgYyTavdWQzAPx_DFS6Akdtq2ZN7fMU06GUkbPHH9PJ0LezcR3lyfU6UrDOjSwjpj6lWs8wBIJCAC342wZqaj0ss9Y-Tbb9-VPg06UDDvkgtcxdmkE1KuIeTf8BvajAbZ6Z-75RUOuKVnA9vE8k3PXbFvb7jh2uer3qXx2E6-vev1HlnLMpU',
    badge: 'AVOID',
    badgeColor: 'bg-red-500',
    icon: Ban,
    iconColor: 'text-red-500',
  },
];

const MEAL_PLAN = [
  { time: 'Breakfast • 8:00 AM', title: 'Oatmeal with Blueberries', meta: '320 kcal • Fiber Rich', icon: Sunset, iconBg: 'bg-orange-500/20 border-orange-500/30 text-orange-500' },
  { time: 'Lunch • 1:00 PM', title: 'Grilled Chicken Salad', meta: '450 kcal • Lean Protein', icon: Sun, iconBg: 'bg-blue-500/20 border-blue-500/30 text-blue-500' },
  { time: 'Snack • 4:00 PM', title: 'Greek Yogurt & Apple', meta: '180 kcal • Probiotic', icon: Coffee, iconBg: 'bg-purple-500/20 border-purple-500/30 text-purple-500' },
  { time: 'Dinner • 7:30 PM', title: 'Steamed Salmon & Quinoa', meta: '520 kcal • Heart Healthy', icon: Moon, iconBg: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-500' },
];

function FoodAdvisorNavBar() {
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
          <button className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors">
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
              <span className="text-sm font-bold text-white">John Doe</span>
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
          <h2 className="text-3xl font-bold mb-2">Good Afternoon, John</h2>
          <p className="text-blue-100 text-lg max-w-xl">
            We've updated your dietary recommendations based on your recent diagnosis.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2.5 w-fit mt-2">
          <ShieldCheck className="w-5 h-5 text-amber-300" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/60">Active Protocol</p>
            <p className="font-bold text-sm">Hypertension (Stage 1)</p>
          </div>
        </div>
      </div>
      <UtensilsCrossed className="absolute -right-6 -bottom-10 w-[200px] h-[200px] text-white/5 rotate-12" />
    </div>
  );
}

function CheckFoodSafety() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-white">Check Food Safety</h3>
        <a href="#" className="text-sm text-primary font-medium hover:underline">
          View History
        </a>
      </div>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-12 pr-12 py-4 bg-card-dark border-0 ring-1 ring-sidebar-border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm text-lg transition-shadow focus:outline-none"
          placeholder="Search for food (e.g., 'Banana', 'Canned Soup')..."
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-sidebar-hover hover:bg-sidebar-border text-gray-400 p-2 rounded-lg transition-colors">
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function RecommendedForYou() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <h3 className="text-lg font-bold text-white">Recommended for You</h3>
        <span className="text-xs font-medium text-gray-400 bg-sidebar-hover px-2 py-1 rounded-full">Safe to Eat</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RECOMMENDED_FOODS.map((food) => (
          <div
            key={food.name}
            className="bg-card-dark rounded-xl p-4 border border-sidebar-border shadow-sm hover:shadow-md transition-all flex gap-4 group cursor-pointer"
          >
            <div className="w-24 h-24 shrink-0 rounded-lg bg-sidebar-hover overflow-hidden relative">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute top-1 left-1 ${food.badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm`}>
                {food.badge}
              </div>
            </div>
            <div className="flex flex-col justify-between py-1">
              <div>
                <h4 className="font-bold text-white text-lg">{food.name}</h4>
                <p className="text-xs text-gray-400">{food.category}</p>
              </div>
              <div className="flex items-start gap-1.5 mt-2 bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-green-200 leading-snug">{food.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoodsToLimitOrAvoid() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <h3 className="text-lg font-bold text-white">Foods to Limit or Avoid</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LIMIT_AVOID_FOODS.map((food) => {
          const Icon = food.icon;
          return (
            <div
              key={food.name}
              className="bg-card-dark rounded-xl overflow-hidden border border-sidebar-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-32 bg-sidebar-hover relative overflow-hidden group">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-2 left-2 ${food.badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm`}>
                  {food.badge}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">{food.name}</h4>
                <div className="flex items-start gap-1.5 mt-2">
                  <Icon className={`w-4 h-4 ${food.iconColor} shrink-0 mt-0.5`} />
                  <p className="text-xs text-gray-300 leading-relaxed">{food.tip}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyMealPlan() {
  return (
    <div className="bg-card-dark rounded-2xl border border-sidebar-border shadow-lg overflow-hidden">
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <h3 className="font-bold text-white">Daily Meal Plan</h3>
        <button className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          AI Generate
        </button>
      </div>
      <div className="p-6 relative">
        <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-sidebar-border" />
        <div className="flex flex-col gap-8">
          {MEAL_PLAN.map((meal) => {
          const Icon = meal.icon;
          return (
            <div key={meal.time} className="relative pl-10">
              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border flex items-center justify-center z-10 ${meal.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{meal.time}</span>
                <h4 className="font-bold text-gray-200">{meal.title}</h4>
                <p className="text-xs text-gray-500">{meal.meta}</p>
              </div>
            </div>
          );
        })}
        </div>
        <button className="w-full mt-8 py-2.5 rounded-xl border border-sidebar-border text-sm font-semibold text-gray-300 hover:bg-sidebar-hover transition-colors">
          View Full Week Plan
        </button>
      </div>
    </div>
  );
}

function HydrationGoal() {
  return (
    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="w-5 h-5" />
          <h4 className="font-bold text-lg">Hydration Goal</h4>
        </div>
        <p className="text-blue-100 text-sm mb-4">Proper hydration helps regulate blood pressure.</p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold">1.2</span>
          <span className="text-sm font-medium opacity-80 mb-1">/ 2.5 Liters</span>
        </div>
        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
          <div className="bg-white h-full rounded-full" style={{ width: '48%' }} />
        </div>
      </div>
      <Droplets className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
    </div>
  );
}

export default function FoodAdvisor() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto bg-background-dark">
        <FoodAdvisorNavBar />
        <main className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <WelcomeBanner />
              <CheckFoodSafety />
              <RecommendedForYou />
              <FoodsToLimitOrAvoid />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
              <DailyMealPlan />
              <HydrationGoal />
            </div>
          </div>
        </main>
      </div>
    </ChatLayout>
  );
}
