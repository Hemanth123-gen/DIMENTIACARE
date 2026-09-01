import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { BrainGames } from './pages/BrainGames';
import { MyDay } from './pages/MyDay';
import { Memories } from './pages/Memories';
import { Reminders } from './pages/Reminders';
import { Help } from './pages/Help';
import { TalkToMe } from './pages/TalkToMe';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { storageService } from './services/storageService';
import type { UserProfile } from './services/storageService';
import type { PatientSettings } from './data/demoData';
import { LanguageProvider } from './context/LanguageContext';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<PatientSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    storageService.init();
    setCurrentUser(storageService.getCurrentUser());
    setSettings(storageService.getSettings());
  }, []);

  const handleSettingsChange = (newSettings: PatientSettings) => {
    setSettings(newSettings);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setSettings(storageService.getSettings());
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-lavender">
        <div className="text-brand-purple font-bold text-lg animate-pulse">
          Loading Second Brain...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LanguageProvider>
        <Login onLoginSuccess={handleLoginSuccess} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Layout 
          textSize={settings.textSize} 
          highContrast={settings.highContrast}
          onLogout={handleLogout}
        >
          <Routes>
            <Route 
              path="/" 
              element={
                currentUser.role === 'Caregiver' 
                  ? <Navigate to="/caregiver" replace /> 
                  : <Home />
              } 
            />
            <Route path="/games" element={<BrainGames />} />
            <Route path="/day" element={<MyDay />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/help" element={<Help />} />
            <Route path="/talk-to-me" element={<TalkToMe />} />
            <Route path="/caregiver" element={<CaregiverDashboard />} />
            <Route path="/settings" element={<Settings onSettingsChange={handleSettingsChange} onLogout={handleLogout} />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
};

export default App;
