import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GameModeSelector } from './components/GameModeSelector';
import { SpotFakeNews } from './components/games/SpotFakeNews';
import { ImageDetective } from './components/games/ImageDetective';
import { ClickbaitBuster } from './components/games/ClickbaitBuster';
import { SourceSleuth } from './components/games/SourceSleuth';
import { Profile } from './components/Profile';
import { Leaderboard } from './components/Leaderboard';
import { LearningHub } from './components/LearningHub';
import { AuthModal } from './components/AuthModal';
import { UserProvider } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';

export type Screen = 'dashboard' | 'games' | 'spot-fake-news' | 'image-detective' | 'clickbait-buster' | 'source-sleuth' | 'profile' | 'leaderboard' | 'learning-hub';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(true);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'games':
        return <GameModeSelector onSelectGame={setCurrentScreen} onBack={() => setCurrentScreen('dashboard')} />;
      case 'spot-fake-news':
        return <SpotFakeNews onBack={() => setCurrentScreen('games')} />;
      case 'image-detective':
        return <ImageDetective onBack={() => setCurrentScreen('games')} />;
      case 'clickbait-buster':
        return <ClickbaitBuster onBack={() => setCurrentScreen('games')} />;
      case 'source-sleuth':
        return <SourceSleuth onBack={() => setCurrentScreen('games')} />;
      case 'profile':
        return <Profile onBack={() => setCurrentScreen('dashboard')} />;
      case 'leaderboard':
        return <Leaderboard onBack={() => setCurrentScreen('dashboard')} />;
      case 'learning-hub':
        return <LearningHub onBack={() => setCurrentScreen('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <main className="pt-16">
        {renderScreen()}
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </UserProvider>
  );
}

export default App;