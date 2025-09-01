import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameResult {
  gameMode: string;
  score: number;
  accuracy: number;
  timeSpent: number;
}

interface Challenge {
  title: string;
  description: string;
  gameMode: string;
  xpReward: number;
}

interface GameContextType {
  gameResults: GameResult[];
  dailyChallenge: Challenge;
  weeklyChallenge: Challenge;
  addGameResult: (result: GameResult) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const dailyChallenge: Challenge = {
    title: "Trending Topics Truth Check",
    description: "Analyze 5 trending news stories and identify which ones are legitimate",
    gameMode: "spot-fake-news",
    xpReward: 50,
  };

  const weeklyChallenge: Challenge = {
    title: "Master Detective Challenge",
    description: "Complete challenges across all 4 game modes to prove your media literacy mastery",
    gameMode: "mixed",
    xpReward: 200,
  };

  const addGameResult = (result: GameResult) => {
    setGameResults(prev => [...prev, result]);
  };

  return (
    <GameContext.Provider value={{
      gameResults,
      dailyChallenge,
      weeklyChallenge,
      addGameResult,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}