import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Brain, 
  Calendar, 
  Image, 
  Bell, 
  LifeBuoy, 
  Mic, 
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { SVGBrain } from '../SVGIcons';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, textSize, highContrast, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const currentUser = storageService.getCurrentUser();
  const userName = currentUser ? currentUser.name : 'Ravi Kumar';
  const localizedRole = currentUser?.role === 'Caregiver' ? (t('role.caregiver') || 'Caregiver') : (t('role.patient') || 'Patient');
  const localizedLang = currentUser?.language ? (t(`lang.${currentUser.language}`) || currentUser.language) : '';
  const userSub = currentUser ? `${localizedRole} • ${localizedLang}` : 'Guwahati, NER';
  const userInitial = userName.charAt(0).toUpperCase();

  const isCaregiver = currentUser?.role === 'Caregiver';

  const navItems = isCaregiver ? [
    { to: '/caregiver', label: t('nav.caregiver') || 'Caregiver Dashboard', icon: Home },
    { to: '/memories', label: t('nav.memories'), icon: Image },
    { to: '/settings', label: t('nav.settings'), icon: SettingsIcon }
  ] : [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/games', label: t('nav.brainGames'), icon: Brain },
    { to: '/day', label: t('nav.myDay'), icon: Calendar },
    { to: '/memories', label: t('nav.memories'), icon: Image },
    { to: '/reminders', label: t('nav.reminders'), icon: Bell },
    { to: '/help', label: t('nav.help'), icon: LifeBuoy },
  ];

  const getScaleClass = () => {
    if (textSize === 'large') return 'text-scale-large';
    if (textSize === 'xlarge') return 'text-scale-xlarge';
    return 'text-scale-normal';
  };  // Time-based environment styling in Asia/Kolkata (IST)
  const [timePeriod, setTimePeriod] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    const updatePeriod = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        hour12: false
      });
      const istHour = parseInt(formatter.format(new Date()), 10);
      if (istHour >= 5 && istHour < 12) {
        setTimePeriod('morning');
      } else if (istHour >= 12 && istHour < 17) {
        setTimePeriod('afternoon');
      } else if (istHour >= 17 && istHour < 21) {
        setTimePeriod('evening');
      } else {
        setTimePeriod('night');
      }
    };
    updatePeriod();
    const interval = setInterval(updatePeriod, 60000);
    return () => clearInterval(interval);
  }, []);

  const getEnvBgClass = () => {
    switch (timePeriod) {
      case 'morning':
        return 'bg-gradient-to-br from-[#E0F2FE] via-[#F7FCFF] to-[#E8F5E9]'; // Bright ocean morning sun + soft green tint
      case 'afternoon':
        return 'bg-gradient-to-br from-[#BAE6FD] via-[#F0F9FF] to-[#E0F2FE]'; // Vibrant bright blue ocean sky
      case 'evening':
        return 'bg-gradient-to-br from-[#FEE2E2] via-[#E0F2FE] to-[#FDE8E8]'; // Soft pink/gold horizon sunset
      case 'night':
        return 'bg-gradient-to-br from-[#0F2942] via-[#12344D] to-[#075985] text-white'; // Deep moonlit night sky
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin bg-brand-purpleLight border-r border-brand-purple/20 p-6 text-brand-navy transition-all duration-500">
      {/* Brand Header & Mobile Close Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setMobileMenuOpen(false); navigate('/'); }}>
          <SVGBrain className="w-10 h-10 text-brand-purple" />
          <div>
            <h2 className="font-bold text-xl text-brand-navy tracking-tight">{t('brand.title') || 'Second Brain'}</h2>
            <p className="text-xs text-brand-grayText">{t('brand.subtitle') || 'Your memory companion'}</p>
          </div>
        </div>
        {/* Close Button */}
        <button 
          onClick={() => {
            setMobileMenuOpen(false);
            setSidebarExpanded(false);
          }} 
          className="p-1.5 rounded-lg hover:bg-brand-purple/20 text-brand-grayText"
          aria-label="Close navigation menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all duration-300
                ${isActive 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-brand-grayText hover:bg-brand-purple/10 hover:text-brand-navy'}
              `}
            >
              <Icon className="w-6 h-6 stroke-[2.5]" />
              <span className="text-base">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Talk To Me Action Button */}
      {!isCaregiver && (
        <div className="mt-auto pt-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/talk-to-me');
            }}
            className="w-full bg-brand-blue text-white hover:bg-opacity-95 active:scale-[0.98] py-4 px-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-md"
          >
            <Mic className="w-6 h-6" />
            <span>{t('nav.talkToMe')}</span>
          </button>
        </div>
      )}

      {/* Profile / Settings / Logout link */}
      <div className="mt-6 flex flex-col gap-2 border-t border-brand-purple/20 pt-4">
        <div 
          onClick={() => {
            setMobileMenuOpen(false);
            navigate('/settings');
          }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-purple/15 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-brand-navy truncate">{userName}</h4>
              <p className="text-xs text-brand-grayText truncate">{userSub}</p>
            </div>
            <SettingsIcon className="w-5 h-5 text-brand-grayText hover:text-brand-purple transition-colors" />
          </div>

          {onLogout && (
            <button
              onClick={() => {
                if (window.confirm(t('logout.confirm') || 'Do you want to log out?')) {
                  setMobileMenuOpen(false);
                  onLogout();
                }
              }}
              className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-brand-red hover:bg-brand-redBg/30 rounded-xl transition-all w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout.label') || 'Log Out'}</span>
            </button>
          )}
        </div>
      </div>
  );

  return (
    <div className={`h-screen overflow-hidden flex flex-col lg:flex-row bg-brand-lavender ${getScaleClass()} ${highContrast ? 'high-contrast-mode' : ''} transition-all duration-700`}>
      {/* Mobile/Tablet Top Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-brand-purple/15 sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <SVGBrain className="w-8 h-8 text-brand-purple" />
          <h1 className="font-bold text-lg text-brand-navy">{t('brand.title') || 'Second Brain'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/settings')} 
            className="p-2 text-brand-grayText hover:text-brand-purple transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-navy focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Desktop Menu Open Button */}
      {!sidebarExpanded && (
        <button
          onClick={() => setSidebarExpanded(true)}
          className="hidden lg:flex fixed top-6 left-6 z-50 p-3 bg-white border border-brand-purple/20 hover:bg-brand-purpleLight rounded-2xl shadow-md text-brand-purple transition-all active:scale-[0.98]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-7 h-7" />
        </button>
      )}

      {/* Mobile/Tablet Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="fixed inset-0 bg-brand-navy bg-opacity-40" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-80 max-w-[85vw] h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {sidebarExpanded && (
        <aside className="hidden lg:block w-72 lg:w-80 h-full flex-shrink-0 z-40 relative">
          <SidebarContent />
        </aside>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 h-full overflow-y-auto ${getEnvBgClass()} relative transition-all duration-700`}>
        {/* Soft Ambient Environment Details */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          {/* Waves background */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-purple/20 to-transparent animate-pulse" />
          {/* Floating leaf element */}
          <div className="absolute top-10 right-10 text-brand-green opacity-45 transform rotate-12 transition-all duration-[8000ms] hover:rotate-45">🌿</div>
          <div className="absolute bottom-16 right-20 text-brand-purple opacity-30">🌸</div>
          {timePeriod === 'night' && (
            <>
              <div className="absolute top-12 left-12 text-yellow-100 opacity-60">🌙</div>
              <div className="absolute top-24 right-32 text-white w-1 h-1 bg-white rounded-full animate-ping" />
            </>
          )}
        </div>
        <div className={`flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24 relative z-10 ${!sidebarExpanded ? 'lg:pl-20' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
