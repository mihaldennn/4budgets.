
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ThumbsUp, Star, Diamond, Trophy, Sparkles, Search, ArrowRight, ShoppingBag,
  Crown, Zap, MessageCircle, Infinity, ShieldCheck, User, LogOut, Settings as SettingsIcon, Moon, Sun, Type, Eye
} from 'lucide-react';
import { BudgetTierInfo, CatalogCategory, UserProfile } from './types';
import Advisor from './components/Advisor';

declare var google: any;

// --- DATA ---

const BUDGET_TIERS: BudgetTierInfo[] = [
  {
    id: 'basic',
    title: 'Basic',
    description: 'Ideal for who is looking for budget-friendly solutions without sacrificing essentials.',
    accentColor: 'text-[#9F7AEA]', // Soft Purple
    iconColor: '#64748b', // Slate for clay look
    iconName: 'thumbsup'
  },
  {
    id: 'standard',
    title: 'Standard',
    description: 'A perfect balance between quality and price, great value for money.',
    accentColor: 'text-[#9F7AEA]',
    iconColor: '#fbbf24', // Gold
    iconName: 'star'
  },
  {
    id: 'premium',
    title: 'Premium',
    description: 'Offers high-quality products with refined design and superior performance.',
    accentColor: 'text-[#9F7AEA]',
    iconColor: '#3b82f6', // Blue
    iconName: 'diamond'
  },
  {
    id: 'elite',
    title: 'Elite',
    description: 'Luxury products made with premium materials and a wide range of features.',
    accentColor: 'text-[#9F7AEA]',
    iconColor: '#e11d48', // Red/Bronze
    iconName: 'trophy'
  }
];

const CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: 'electronics', title: 'Electronics', description: 'Fridges, TVs, Office Computers, Printer...' },
  { id: 'gaming', title: 'Gaming', description: 'Gaming PC Parts, Mouses, Keyboards...' },
  { id: 'house', title: 'House', description: 'Libraries, Desks, Shelves, Wardrobes...' },
  { id: 'gardening', title: 'Gardening', description: 'Shovels, Dirt, Gloves...' },
  { id: 'school', title: 'School', description: 'Pens, Books, Backpacks...' },
  { id: 'car', title: 'Car', description: 'Carpets, Parfumes, Chargers...' },
  { id: 'music', title: 'Music', description: 'Speakers, Microphones...' },
  { id: 'sport', title: 'Sport', description: 'Football, Tennis, Basket...' },
];

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`font-extrabold tracking-tight flex items-center ${className}`}>
    <span className="text-[#9F7AEA]">4</span>
    <span className="text-white">budgets</span>
    <span className="text-[#9F7AEA]">.</span>
  </div>
);

// --- TYPES & HELPERS ---

type Page = 'home' | 'catalog' | 'us' | 'subscription' | 'profile' | 'settings';
type Theme = 'dark' | 'light';
type ColorMode = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia';

// Helper to get theme-based classes
const getThemeClasses = (theme: Theme) => ({
  bgMain: theme === 'dark' ? 'bg-black' : 'bg-slate-50',
  textMain: theme === 'dark' ? 'text-white' : 'text-slate-900',
  textSecondary: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
  cardBg: theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white shadow-xl shadow-slate-200/50',
  cardBorder: theme === 'dark' ? 'border-white/5' : 'border-slate-100',
  heading: theme === 'dark' ? 'text-white' : 'text-slate-900',
});

// Helper to decode JWT from Google
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const GOOGLE_CLIENT_ID = "832028023360-mvm84u7o7utb19vrhsa2fgd9sv5qlnej.apps.googleusercontent.com";

// --- COMPONENTS ---

const Navbar = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  onNavigate,
  currentPage,
  user
}: { 
  mobileMenuOpen: boolean, 
  setMobileMenuOpen: (v: boolean) => void,
  onNavigate: (page: Page) => void,
  currentPage: string,
  user: UserProfile | null
}) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E] text-white py-6 shadow-lg shadow-[#0B3D2E]/20">
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <div className="cursor-pointer hover:opacity-90 transition-opacity" onClick={() => onNavigate('home')}>
        <Logo className="text-3xl" />
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-10">
        <div className="flex gap-10 text-[13px] font-bold tracking-wider uppercase">
          <button onClick={() => onNavigate('home')} className={`hover:text-[#9F7AEA] transition-colors ${currentPage === 'home' ? 'text-[#9F7AEA]' : ''}`}>Home</button>
          <button onClick={() => onNavigate('catalog')} className={`hover:text-[#9F7AEA] transition-colors ${currentPage === 'catalog' ? 'text-[#9F7AEA]' : ''}`}>Products</button>
          <button onClick={() => onNavigate('us')} className={`hover:text-[#9F7AEA] transition-colors ${currentPage === 'us' ? 'text-[#9F7AEA]' : ''}`}>Us</button>
          <button onClick={() => onNavigate('subscription')} className={`hover:text-[#9F7AEA] transition-colors ${currentPage === 'subscription' ? 'text-[#9F7AEA]' : ''}`}>Subscription</button>
        </div>
        
        <div className="w-px h-6 bg-white/20"></div>

        <button 
          onClick={() => onNavigate('profile')}
          className={`p-1 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 ${currentPage === 'profile' ? 'text-[#9F7AEA] bg-white/10' : ''}`}
        >
          {user ? (
            <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" />
          ) : (
            <div className="p-1"><User size={24} /></div>
          )}
        </button>
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 md:hidden">
        <button 
            onClick={() => onNavigate('profile')}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${currentPage === 'profile' ? 'text-[#9F7AEA]' : ''}`}
          >
            {user ? (
               <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" />
            ) : (
               <User size={24} />
            )}
        </button>
        <button 
          className="text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </div>

    {/* Mobile Nav Dropdown */}
    {mobileMenuOpen && (
      <div className="md:hidden bg-[#0a3528] py-4 px-6 flex flex-col gap-4 border-t border-white/10">
        <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="text-base font-bold uppercase text-left">Home</button>
        <button onClick={() => { onNavigate('catalog'); setMobileMenuOpen(false); }} className="text-base font-bold uppercase text-left">Products</button>
        <button onClick={() => { onNavigate('us'); setMobileMenuOpen(false); }} className="text-base font-bold uppercase text-left">Us</button>
        <button onClick={() => { onNavigate('subscription'); setMobileMenuOpen(false); }} className="text-base font-bold uppercase text-left">Subscription</button>
      </div>
    )}
  </header>
);

const HomeView = ({ onNavigate, setShowAdvisor, getIcon, theme }: any) => {
  const styles = getThemeClasses(theme);

  return (
    <>
      {/* HERO SECTION */}
      <section id="home" className="pt-48 pb-40 px-6 bg-[#0B3D2E] flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[85vh]">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

        <h1 className="text-5xl md:text-8xl font-black mb-12 max-w-5xl leading-[1.1] tracking-tight drop-shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 text-white">
          Your Future, Your <br/>
          Finances, Your Way<span className="text-[#9F7AEA]">.</span>
        </h1>
        
        <div className="mt-16 flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <button 
            onClick={() => onNavigate('catalog')}
            className="group relative bg-black text-white text-xl md:text-2xl font-black tracking-widest uppercase px-16 py-8 rounded-[2rem] border-2 border-white/10 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 shadow-2xl flex items-center gap-4 w-full md:w-auto justify-center"
          >
            <ShoppingBag size={32} className="text-[#9F7AEA] group-hover:text-black transition-colors" />
            <span>Explore Catalog</span>
          </button>
          
          <button 
            onClick={() => setShowAdvisor(true)}
            className="group relative flex items-center justify-center gap-4 bg-[#5040AE] text-white text-xl md:text-2xl font-black tracking-widest uppercase px-16 py-8 rounded-[2rem] hover:bg-[#433596] hover:scale-105 hover:shadow-[0_0_40px_rgba(80,64,174,0.5)] transition-all duration-300 shadow-2xl shadow-[#5040AE]/30 w-full md:w-auto"
          >
            <Sparkles size={32} className="text-purple-200 animate-pulse" />
            <span>AI Helper</span>
          </button>
        </div>
      </section>

      {/* THE LEVELS SECTION */}
      <section id="products" className={`py-32 px-6 ${styles.bgMain} relative transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className={`text-4xl md:text-6xl font-black tracking-tight mb-4 ${styles.heading}`}>
              The <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Levels</span>
              <span className="text-white">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BUDGET_TIERS.map((tier) => (
              <div 
                key={tier.id}
                className={`group ${styles.cardBg} rounded-[3rem] p-10 md:p-16 flex flex-col items-center text-center border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#9F7AEA]/10 hover:-translate-y-2 cursor-pointer`}
              >
                <div className="mb-10 transform group-hover:scale-110 transition-transform duration-500">
                  {getIcon(tier.iconName, tier.iconColor)}
                </div>

                <h3 className={`text-5xl md:text-6xl font-black mb-6 ${tier.accentColor} tracking-tight`}>
                  {tier.title}
                </h3>
                <p className={`${styles.textSecondary} text-xl md:text-2xl font-bold leading-normal`}>
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO ARE WE / FOOTER SECTION */}
      <section id="us" className="pt-32 pb-16 px-6 bg-[#0B3D2E] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-20 text-white">Who are <span className="text-[#9F7AEA]">we</span>?</h2>
          
          <div className="space-y-16 text-base md:text-lg leading-relaxed font-semibold text-white/90">
            <div className="max-w-2xl mx-auto">
              <h4 className="font-bold text-white mb-3 uppercase tracking-widest text-sm opacity-60">What is 4budgets?</h4>
              <p>A one-stop platform to help you find the best deals, manage expenses, and make smarter financial decisions, no matter your budget.</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <h4 className="font-bold text-white mb-3 uppercase tracking-widest text-sm opacity-60">Why Choose Us?</h4>
              <ul className="space-y-2">
                <li><span className="font-extrabold text-[#9F7AEA]">Affordable Options</span> – Curated selections for every budget</li>
                <li><span className="font-extrabold text-[#9F7AEA]">Smart Savings</span> – Tips & tools to maximize your money</li>
                <li><span className="font-extrabold text-[#9F7AEA]">Futuristic & Efficient</span> – AI-driven recommendations for better spending</li>
              </ul>
            </div>

            <p className="opacity-70 text-sm max-w-xl mx-auto">Empowering everyone to live well within their means, without compromise.</p>
          </div>

          <button 
            onClick={() => onNavigate('us')}
            className="mt-20 bg-white text-[#0B3D2E] text-base font-bold tracking-widest uppercase px-16 py-6 rounded-xl hover:bg-purple-50 transition-colors shadow-lg flex items-center gap-3 mx-auto"
          >
            Read More <ArrowRight size={20} />
          </button>

          <div className="mt-32 border-t border-white/10 pt-12 flex flex-col items-center gap-6">
            <Logo className="text-4xl" />
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Official Amazon Affiliate
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

const CatalogView = ({ theme }: { theme: Theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const styles = getThemeClasses(theme);

  const filteredCategories = CATALOG_CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${styles.bgMain} flex flex-col pt-24 transition-colors duration-500`}>
      {/* Catalog Header */}
      <section className="bg-[#0B3D2E] px-6 pt-24 pb-32 text-center rounded-b-[3rem] shadow-2xl relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-12 drop-shadow-sm">
          The Catalog<span className="text-[#9F7AEA]">.</span>
        </h1>
        
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-[#9F7AEA]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-[#f8fafc] rounded-full shadow-xl flex items-center p-3 overflow-hidden border-4 border-transparent focus-within:border-[#9F7AEA]/50 transition-colors">
            <div className="pl-6 text-slate-400">
               <Search size={28} />
            </div>
            <div className="flex-1 flex flex-col px-4 text-left">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Search here your Product</span>
               <input 
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-transparent border-none outline-none text-slate-900 font-bold text-xl placeholder-slate-300 h-10"
               />
            </div>
            <button className="p-4 bg-transparent text-slate-400 hover:text-[#5040AE] transition-colors">
              <Search size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="flex-1 px-6 -mt-16 pb-32 z-20 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-6">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id}
              className={`group ${styles.cardBg} rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-center justify-between gap-8 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#9F7AEA]/10 hover:-translate-y-1 cursor-pointer`}
            >
              <div className="text-center md:text-left">
                <h3 className={`text-3xl md:text-4xl font-black text-[#9F7AEA] mb-3 ${theme === 'dark' ? 'group-hover:text-white' : 'group-hover:text-slate-900'} transition-colors`}>{cat.title}</h3>
                <p className={`${styles.textSecondary} font-medium text-lg md:text-xl`}>{cat.description}</p>
              </div>
              
              <button className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white'} text-sm md:text-lg font-black tracking-[0.2em] uppercase px-10 py-6 rounded-2xl hover:bg-[#9F7AEA] hover:text-white transition-all duration-300 shadow-lg min-w-[160px] flex items-center justify-center gap-3`}>
                <span>View</span>
                <ArrowRight size={24} />
              </button>
            </div>
          ))}

          {filteredCategories.length === 0 && (
             <div className="text-center py-20 text-slate-500">
               <p className="text-xl">No categories found matching "{searchTerm}"</p>
             </div>
          )}
        </div>
      </section>

      {/* Footer Message */}
      <section className={`py-20 text-center border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} mx-6`}>
         <p className={`text-xl md:text-3xl font-bold ${styles.textMain} max-w-3xl mx-auto leading-normal`}>
           We're bringing <span className="text-[#9F7AEA]">NEW</span> products <span className="text-[#9F7AEA]">EVERY</span> day, stay tuned.
         </p>
      </section>
    </div>
  );
};

const UsView = ({ theme }: { theme: Theme }) => {
  const styles = getThemeClasses(theme);
  
  return (
    <div className={`min-h-screen ${styles.bgMain} flex flex-col pt-24 transition-colors duration-500`}>
       {/* Header */}
       <section className="bg-[#0B3D2E] px-6 pt-24 pb-32 text-center rounded-b-[3rem] shadow-2xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
            About Us<span className="text-[#9F7AEA]">.</span>
          </h1>
          <div className="max-w-4xl mx-auto text-lg md:text-xl font-medium text-white/90 leading-relaxed space-y-6">
             <p>
               <span className="font-bold text-white">4budgets</span> is your go-to platform for smart spending and financial efficiency. 
               We provide expert product comparisons, budget-friendly deals, and money-saving tips to help you make the best purchasing decisions.
             </p>
             <p>
               Whether you're shopping on a tight budget or looking for premium options, 4budgets ensures you get <span className="font-bold text-white">maximum value for every dollar</span>. 
               Empower your finances, shop smarter, and live better with 4budgets. 🚀 💰
             </p>
          </div>
       </section>

       <section className="flex-1 px-6 -mt-16 pb-32 z-20 max-w-6xl mx-auto w-full space-y-8">
          {/* Row 1: Established & Goal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className={`${styles.cardBg} rounded-[3rem] p-10 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all`}>
                <h3 className={`text-2xl font-bold ${styles.heading} mb-4`}>Established in <span className="text-[#9F7AEA]">2025</span></h3>
                <p className={`${styles.textSecondary} leading-relaxed`}>
                  4budgets was born in 2025 as a new, forward-thinking platform designed to address the evolving needs of budgeting in a digital world and grow with his community.
                </p>
             </div>
             <div className={`${styles.cardBg} rounded-[3rem] p-10 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all`}>
                <h3 className={`text-2xl font-bold ${styles.heading} mb-4`}>Our <span className="text-[#9F7AEA]">Goal</span></h3>
                <p className={`${styles.textSecondary} leading-relaxed`}>
                  4budgets was born with the goal of simplifying financial management for individuals and businesses alike. Through innovative tools and resources, it strives to make budgeting more accessible, intuitive, and effective for everyone.
                </p>
             </div>
          </div>

          {/* Row 2: Team & Contact Container */}
          <div className={`${styles.cardBg} rounded-[3rem] p-10 md:p-16 border ${styles.cardBorder} text-center`}>
             <h3 className={`text-3xl md:text-4xl font-black ${styles.heading} mb-12`}>Our <span className="text-[#9F7AEA]">Team</span></h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-4 mb-16">
                <div className="space-y-1">
                   <p className={`text-xl font-bold ${styles.heading}`}>Mihai Ionita</p>
                   <p className="text-[#9F7AEA] text-sm font-bold uppercase tracking-widest">Selling and Web Manager</p>
                </div>
                <div className="space-y-1">
                   <p className={`text-xl font-bold ${styles.heading}`}>Alessandro Florea</p>
                   <p className="text-[#9F7AEA] text-sm font-bold uppercase tracking-widest">Social and Products Manager</p>
                </div>
                <div className="space-y-1">
                   <p className={`text-xl font-bold ${styles.heading}`}>Kimberly Mangiameli</p>
                   <p className="text-[#9F7AEA] text-sm font-bold uppercase tracking-widest">Helper</p>
                </div>
                <div className="space-y-1">
                   <p className={`text-xl font-bold ${styles.heading}`}>Leonardo Soliman</p>
                   <p className="text-[#9F7AEA] text-sm font-bold uppercase tracking-widest">Helper</p>
                </div>
             </div>

             <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} pt-12`}>
                <h3 className={`text-2xl font-black ${styles.heading} mb-4`}>Contact <span className="text-[#9F7AEA]">Us</span></h3>
                <a href="mailto:4budgets.com@gmail.com" className={`text-[#9F7AEA] text-xl font-bold hover:${styles.textMain} transition-colors underline decoration-2 underline-offset-4`}>
                  4budgets.com@gmail.com
                </a>
             </div>
          </div>

          {/* Row 3: Support */}
          <div className="text-center py-8">
             <h3 className={`text-3xl font-black ${styles.heading} mb-6`}>We're Here for You <span className="text-[#9F7AEA]">24/7</span></h3>
             <p className={`${styles.textSecondary} max-w-3xl mx-auto leading-relaxed text-lg`}>
               Whether you have a quick question, need assistance with a budgeting tool, or require guidance on financial planning, our dedicated team is always ready to help. We understand that financial decisions don't happen on a 9-to-5 schedule.
             </p>
          </div>

          {/* Row 4: Colors */}
          <div className={`${styles.cardBg} rounded-[3rem] p-10 border ${styles.cardBorder} text-center`}>
             <h3 className={`text-2xl font-bold ${styles.heading} mb-8`}>The <span className="text-[#9F7AEA]">Colors</span></h3>
             <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-full bg-black border-2 border-white/20 shadow-lg"></div>
                   <span className="font-mono text-xs text-slate-500 uppercase">#000000</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-full bg-white border-2 border-white/20 shadow-lg"></div>
                   <span className="font-mono text-xs text-slate-500 uppercase">#FFFFFF</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-full bg-[#0b3d2e] border-2 border-white/20 shadow-lg"></div>
                   <span className="font-mono text-xs text-slate-500 uppercase">#0b3d2e</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-full bg-[#9F7AEA] border-2 border-white/20 shadow-lg"></div>
                   <span className="font-mono text-xs text-slate-500 uppercase">#9F7AEA</span>
                </div>
             </div>
          </div>

          {/* Footer Collaborators */}
          <div className={`text-center pt-10 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
              <h3 className={`text-xl font-bold ${styles.heading} mb-6`}>Collaborators <span className="text-slate-600">/</span> <span className="text-[#9F7AEA]">Sub-Members</span></h3>
              <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
                 <div className="flex items-center gap-2 justify-center">
                    <span className={`font-bold ${styles.heading}`}>Amazon Affiliate</span>
                    <span className="text-slate-500">https://www.amazon.com/</span>
                 </div>
                 <div className="hidden md:block text-slate-700">•</div>
                 <div className="flex items-center gap-2 justify-center">
                    <span className={`font-bold ${styles.heading}`}>Revolut Pro</span>
                    <span className="text-slate-500">https://www.revolut.com/</span>
                 </div>
              </div>
          </div>

       </section>
    </div>
  )
}

const SubscriptionView = ({ theme }: { theme: Theme }) => {
  const styles = getThemeClasses(theme);

  return (
    <div className={`min-h-screen ${styles.bgMain} flex flex-col pt-24 transition-colors duration-500`}>
       {/* Header */}
       <section className="bg-[#0B3D2E] px-6 pt-24 pb-48 text-center rounded-b-[3rem] shadow-2xl relative z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none"></div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Unlock <span className="text-[#9F7AEA]">Pro</span> Access.
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            One small payment. A lifetime of smarter financial decisions and personalized guidance.
          </p>
       </section>

       <section className="flex-1 px-6 -mt-32 pb-32 z-20 max-w-6xl mx-auto w-full">
          
          {/* Main Pricing Card */}
          <div className="relative mb-24">
            <div className="absolute inset-0 bg-[#9F7AEA]/30 blur-[60px] rounded-full pointer-events-none"></div>
            <div className={`relative ${styles.cardBg} rounded-[3rem] p-10 md:p-16 border border-[#9F7AEA]/40 shadow-[0_0_50px_rgba(159,122,234,0.15)] text-center max-w-4xl mx-auto flex flex-col items-center`}>
              
              <div className="absolute -top-6 bg-gradient-to-r from-[#5040AE] to-[#9F7AEA] text-white text-sm font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full shadow-lg flex items-center gap-2">
                <Crown size={16} fill="white" />
                <span>Best Value</span>
              </div>

              <div className="mb-8">
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">One-time payment</p>
                 <div className="flex items-start justify-center gap-2 leading-none">
                    <span className="text-4xl font-bold text-slate-500 mt-2">€</span>
                    <span className={`text-[8rem] md:text-[10rem] font-black ${styles.heading} tracking-tighter drop-shadow-lg`}>2.99</span>
                 </div>
                 <p className="text-[#9F7AEA] font-bold text-lg -mt-4">Lifetime Access. No monthly fees.</p>
              </div>

              <button className={`w-full md:w-auto ${theme === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white'} text-xl font-black tracking-widest uppercase px-20 py-8 rounded-2xl hover:bg-[#9F7AEA] hover:text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(159,122,234,0.4)] transition-all duration-300 shadow-2xl flex items-center justify-center gap-4 group`}>
                <Zap className="group-hover:fill-white transition-colors" size={28} />
                <span>Get Access Now</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Feature 1 */}
             <div className={`${styles.cardBg} rounded-[2.5rem] p-10 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all hover:-translate-y-1`}>
                <div className="bg-[#9F7AEA]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                   <Sparkles className="text-[#9F7AEA]" size={32} />
                </div>
                <h3 className={`text-2xl font-black ${styles.heading} mb-4`}>AI Bundle Architect</h3>
                <p className={`${styles.textSecondary} leading-relaxed font-medium`}>
                  Don't just browse. Tell the AI <span className={`${styles.heading} italic`}>"I need to rework my garden for €200"</span> and get a complete, custom bundle of products instantly.
                </p>
             </div>

             {/* Feature 2 */}
             <div className={`${styles.cardBg} rounded-[2.5rem] p-10 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all hover:-translate-y-1`}>
                <div className="bg-[#9F7AEA]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                   <MessageCircle className="text-[#9F7AEA]" size={32} />
                </div>
                <h3 className={`text-2xl font-black ${styles.heading} mb-4`}>Expert Human Support</h3>
                <p className={`${styles.textSecondary} leading-relaxed font-medium`}>
                  Get direct access to our dedicated team. Real humans helping you find the specific deals you can't find yourself.
                </p>
             </div>

              {/* Feature 3 */}
              <div className={`${styles.cardBg} rounded-[2.5rem] p-10 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all hover:-translate-y-1`}>
                <div className="bg-[#9F7AEA]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                   <Infinity className="text-[#9F7AEA]" size={32} />
                </div>
                <h3 className={`text-2xl font-black ${styles.heading} mb-4`}>Pay Once, Keep Forever</h3>
                <p className={`${styles.textSecondary} leading-relaxed font-medium`}>
                  Forget recurring subscriptions. Pay the price of a coffee once, and enjoy the Pro benefits for the entire lifetime of your account.
                </p>
             </div>
          </div>

          {/* Trust Footer */}
          <div className="mt-20 text-center flex flex-col items-center gap-4 opacity-60">
             <div className={`flex items-center gap-2 ${styles.textMain} font-bold uppercase tracking-widest text-xs`}>
                <ShieldCheck size={16} />
                <span>Secure Payment via Stripe</span>
             </div>
             <p className="text-slate-500 text-sm max-w-md">
               By upgrading, you support the development of 4budgets and help us keep the platform ad-free and efficient.
             </p>
          </div>

       </section>
    </div>
  );
}

const ProfileView = ({ 
  onNavigate, 
  theme, 
  user, 
  onLoginSuccess,
  onSimulateLogin
}: { 
  onNavigate: (page: Page) => void, 
  theme: Theme, 
  user: UserProfile | null, 
  onLoginSuccess: (credentialResponse: any) => void,
  onSimulateLogin: () => void
}) => {
  const styles = getThemeClasses(theme);

  useEffect(() => {
    if (!user) {
      /* global google */
      const initializeGoogleBtn = () => {
         // @ts-ignore
         if (typeof google !== 'undefined' && google.accounts) {
           // @ts-ignore
           google.accounts.id.initialize({
             client_id: GOOGLE_CLIENT_ID,
             callback: onLoginSuccess
           });
           const btnDiv = document.getElementById("googleSignInBtn");
           if (btnDiv) {
             // @ts-ignore
             google.accounts.id.renderButton(
               btnDiv,
               { theme: "outline", size: "large", width: "100%", shape: "pill", text: "continue_with" } 
             );
           }
         }
      };

      // Check if google script is loaded, if not, wait for it or set interval
      if (typeof google !== 'undefined' && google.accounts) {
         initializeGoogleBtn();
      } else {
         const timer = setInterval(() => {
            if (typeof google !== 'undefined' && google.accounts) {
               initializeGoogleBtn();
               clearInterval(timer);
            }
         }, 500);
         return () => clearInterval(timer);
      }
    }
  }, [user, onLoginSuccess]);

  const handleLogout = () => {
    // In a real app, this would clear the session
    window.location.reload(); 
  };

  return (
    <div className={`min-h-screen ${styles.bgMain} flex flex-col pt-24 transition-colors duration-500`}>
       {/* Header */}
       <section className="bg-[#0B3D2E] px-6 pt-24 pb-32 text-center rounded-b-[3rem] shadow-2xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Your <span className="text-[#9F7AEA]">Profile</span>.
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Manage your account, subscription, and preferences all in one place.
          </p>
       </section>

       <section className="flex-1 px-6 -mt-20 pb-32 z-20 max-w-4xl mx-auto w-full">
         
         {!user ? (
           // LOGIN CARD
           <div className={`${styles.cardBg} rounded-[3rem] p-10 md:p-20 border ${styles.cardBorder} shadow-2xl flex flex-col items-center text-center`}>
              <div className="bg-[#9F7AEA]/10 p-6 rounded-full mb-8">
                <User size={64} className="text-[#9F7AEA]" />
              </div>
              <h2 className={`text-3xl md:text-4xl font-black ${styles.heading} mb-4`}>Welcome Back</h2>
              <p className={`${styles.textSecondary} text-lg mb-12 max-w-md`}>
                Sign in to access your saved bundles, track your subscription, and talk to our expert advisors.
              </p>
              
              <div id="googleSignInBtn" className="w-full max-w-sm flex justify-center min-h-[50px]"></div>

              <div className="mt-8 border-t border-slate-700/50 pt-6 w-full max-w-sm">
                <button 
                  onClick={onSimulateLogin}
                  className="text-slate-500 hover:text-[#9F7AEA] text-sm underline font-semibold transition-colors"
                >
                  (Developer) Simulate Login Bypass
                </button>
              </div>

              <p className="mt-6 text-xs text-slate-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
           </div>
         ) : (
           // DASHBOARD CARD
           <div className="space-y-6">
             {/* User Info Card */}
             <div className={`${styles.cardBg} rounded-[3rem] p-8 md:p-12 border ${styles.cardBorder} flex flex-col md:flex-row items-center gap-8 relative overflow-hidden`}>
                {/* Fixed Graphic Bug: Moved logo to bottom-right and disabled pointer events */}
                <div className="absolute bottom-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Logo className="text-6xl grayscale" />
                </div>

                <div className="shrink-0 relative z-10">
                  <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-[#9F7AEA] shadow-lg" />
                </div>
                
                <div className="text-center md:text-left flex-1 z-10">
                  <h2 className={`text-3xl font-black ${styles.heading} mb-1`}>{user.name}</h2>
                  <p className="text-slate-400 font-medium mb-4">{user.email}</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} border text-xs font-bold uppercase tracking-wider text-slate-400`}>
                    <Star size={12} className="text-slate-400" />
                    <span>Free Plan</span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className={`p-3 ${theme === 'dark' ? 'bg-white/5 hover:bg-red-500/10' : 'bg-slate-100 hover:bg-red-50'} rounded-xl text-slate-400 hover:text-red-500 transition-colors z-10`}
                  title="Sign Out"
                >
                  <LogOut size={24} />
                </button>
             </div>

             {/* Actions Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => onNavigate('subscription')}
                  className={`${styles.cardBg} rounded-[2.5rem] p-8 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all cursor-pointer group`}
                >
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#9F7AEA]/10 rounded-xl group-hover:bg-[#9F7AEA] transition-colors">
                        <Zap className="text-[#9F7AEA] group-hover:text-white" size={24} />
                      </div>
                      <h3 className={`text-xl font-bold ${styles.heading}`}>Your Subscription</h3>
                   </div>
                   <p className="text-slate-400 text-sm mb-6">You are currently on the Free plan. Upgrade to access AI Architect.</p>
                   <button className="text-[#9F7AEA] font-bold text-sm uppercase tracking-wider hover:text-white transition-colors">Upgrade to Pro &rarr;</button>
                </div>

                <div 
                  onClick={() => onNavigate('settings')}
                  className={`${styles.cardBg} rounded-[2.5rem] p-8 border ${styles.cardBorder} hover:border-[#9F7AEA]/30 transition-all cursor-pointer group`}
                >
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#9F7AEA]/10 rounded-xl group-hover:bg-[#9F7AEA] transition-colors">
                        <SettingsIcon className="text-[#9F7AEA] group-hover:text-white" size={24} />
                      </div>
                      <h3 className={`text-xl font-bold ${styles.heading}`}>More</h3>
                   </div>
                   <p className="text-slate-400 text-sm mb-6">Manage your app appearance and accessibility preferences.</p>
                   <button className="text-[#9F7AEA] font-bold text-sm uppercase tracking-wider hover:text-white transition-colors">Manage &rarr;</button>
                </div>
             </div>
           </div>
         )}

       </section>
    </div>
  );
};

const SettingsView = ({ 
  theme, 
  setTheme, 
  boldMode,
  setBoldMode, 
  colorMode, 
  setColorMode,
  onNavigate 
}: { 
  theme: Theme, 
  setTheme: (t: Theme) => void,
  boldMode: boolean,
  setBoldMode: (b: boolean) => void,
  colorMode: ColorMode,
  setColorMode: (c: ColorMode) => void,
  onNavigate: (p: Page) => void
}) => {
  const styles = getThemeClasses(theme);

  return (
    <div className={`min-h-screen ${styles.bgMain} flex flex-col pt-24 transition-colors duration-500`}>
      {/* Header */}
      <section className="bg-[#0B3D2E] px-6 pt-24 pb-32 text-center rounded-b-[3rem] shadow-2xl relative z-10">
          <div className="absolute left-6 top-32 cursor-pointer" onClick={() => onNavigate('profile')}>
            <div className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
              <ArrowRight size={20} className="rotate-180" />
              <span className="text-sm font-bold uppercase tracking-widest">Back</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            More<span className="text-[#9F7AEA]">.</span>
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">Customize your 4budgets experience.</p>
      </section>

      <section className="flex-1 px-6 -mt-20 pb-32 z-20 max-w-2xl mx-auto w-full space-y-6">
        
        {/* Appearance Card */}
        <div className={`${styles.cardBg} rounded-[2.5rem] p-8 border ${styles.cardBorder}`}>
           <h3 className={`text-xl font-bold ${styles.heading} mb-6 flex items-center gap-3`}>
             <Eye size={24} className="text-[#9F7AEA]" />
             Appearance
           </h3>
           
           <div className="space-y-4">
             {/* Theme Toggle */}
             <div className={`flex items-center justify-between p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-4">
                   {theme === 'dark' ? <Moon size={20} className="text-slate-400"/> : <Sun size={20} className="text-orange-400"/>}
                   <div>
                     <p className={`font-bold ${styles.heading}`}>Website Theme</p>
                     <p className="text-xs text-slate-500">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'} Active</p>
                   </div>
                </div>
                
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#5040AE]' : 'bg-slate-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
             </div>

             {/* Boldness Toggle */}
             <div className={`flex items-center justify-between p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-4">
                   <Type size={20} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}/>
                   <div>
                     <p className={`font-bold ${styles.heading}`}>High Contrast Text</p>
                     <p className="text-xs text-slate-500">Increases font weight for better readability</p>
                   </div>
                </div>
                
                <button 
                  onClick={() => setBoldMode(!boldMode)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${boldMode ? 'bg-[#5040AE]' : 'bg-slate-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${boldMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
             </div>

              {/* Color Blindness Selector */}
             <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-4 mb-4">
                   <Eye size={20} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}/>
                   <div>
                     <p className={`font-bold ${styles.heading}`}>Color Mode</p>
                     <p className="text-xs text-slate-500">Adjust colors for color blindness</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {(['default', 'protanopia', 'deuteranopia', 'tritanopia'] as ColorMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setColorMode(mode)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                        colorMode === mode 
                          ? 'border-[#9F7AEA] bg-[#9F7AEA]/10 text-[#9F7AEA]' 
                          : `${theme === 'dark' ? 'border-transparent bg-white/5 text-slate-400 hover:bg-white/10' : 'border-transparent bg-white text-slate-600 hover:bg-slate-200'}`
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
             </div>
           </div>
        </div>

      </section>
    </div>
  )
}

// --- MAIN APP ---

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('dark');
  const [boldMode, setBoldMode] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>('default');
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleGoogleCredentialResponse = (response: any) => {
    const decoded: any = parseJwt(response.credential);
    if (decoded) {
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
    }
  };

  const simulateLogin = () => {
    setUser({
      name: "Developer User",
      email: "dev@4budgets.test",
      picture: "https://ui-avatars.com/api/?name=Developer+User&background=9F7AEA&color=fff&bold=true"
    });
  };

  const getIcon = (name: string, color: string) => {
    // Styling props to make them look thick and "icon-like"
    const size = 140;
    
    switch (name) {
      case 'thumbsup': 
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-slate-500/20 blur-3xl rounded-full"></div>
            <ThumbsUp size={size} fill={color} stroke="none" className="relative z-10 drop-shadow-2xl" />
          </div>
        );
      case 'star': 
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full"></div>
            <div className="relative z-10 flex items-center justify-center">
               <Star size={size} fill={color} stroke="none" className="drop-shadow-2xl translate-y-2" />
               <Star size={size * 0.6} fill={color} stroke="none" className="drop-shadow-2xl -ml-8 -mt-12 opacity-90" />
            </div>
          </div>
        );
      case 'diamond': 
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <Diamond size={size} fill={color} stroke="none" className="relative z-10 drop-shadow-2xl" />
          </div>
        );
      case 'trophy': 
        return (
           <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
            <Trophy size={size} fill={color} stroke="none" className="relative z-10 drop-shadow-2xl" />
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      {/* SVG Filters definition for Color Blindness simulation */}
      <svg className="hidden">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"/>
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"/>
          </filter>
          <filter id="tritanopia">
             <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0"/>
          </filter>
        </defs>
      </svg>

      <div 
        className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'} font-sans selection:bg-[#9F7AEA] selection:text-white transition-colors duration-500 ${boldMode ? 'font-semibold' : ''}`}
        style={{ filter: colorMode !== 'default' ? `url(#${colorMode})` : 'none' }}
      >
        
        <Navbar 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
          onNavigate={setPage}
          currentPage={page}
          user={user}
        />

        <main>
          {page === 'home' && (
            <HomeView 
              onNavigate={setPage} 
              setShowAdvisor={setShowAdvisor}
              getIcon={getIcon}
              theme={theme}
            />
          )}

          {page === 'catalog' && (
            <CatalogView theme={theme} />
          )}

          {page === 'us' && (
            <UsView theme={theme} />
          )}

          {page === 'subscription' && (
            <SubscriptionView theme={theme} />
          )}

          {page === 'profile' && (
            <ProfileView 
              onNavigate={setPage} 
              theme={theme} 
              user={user}
              onLoginSuccess={handleGoogleCredentialResponse}
              onSimulateLogin={simulateLogin}
            />
          )}

          {page === 'settings' && (
            <SettingsView 
              theme={theme} 
              setTheme={setTheme} 
              boldMode={boldMode}
              setBoldMode={setBoldMode}
              colorMode={colorMode}
              setColorMode={setColorMode}
              onNavigate={setPage} 
            />
          )}
        </main>

        {/* AI Modal Overlay */}
        {showAdvisor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
             <Advisor 
                budgets={[]} 
                transactions={[]} 
                onClose={() => setShowAdvisor(false)} 
              />
          </div>
        )}

      </div>
    </>
  );
};

export default App;
