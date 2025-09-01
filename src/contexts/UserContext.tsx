import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  rank: number;
  stats: {
    accuracy: number;
    gamesPlayed: number;
    totalXp: number;
  };
  achievements: Achievement[];
}

interface Achievement {
  title: string;
  description: string;
  unlockedAt: Date;
}

interface UserContextType {
  user: User | null;
  updateUserStats: (score: number, accuracy: number) => void;
  addAchievement: (achievement: Achievement) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    id: '1',
    username: 'MediaMaster',
    email: 'user@example.com',
    level: 3,
    xp: 850,
    nextLevelXp: 1000,
    streak: 7,
    rank: 142,
    stats: {
      accuracy: 78,
      gamesPlayed: 23,
      totalXp: 850,
    },
    achievements: [
      {
        title: 'First Steps',
        description: 'Complete your first game',
        unlockedAt: new Date('2024-03-01'),
      },
      {
        title: 'Streak Master',
        description: 'Maintain a 7-day playing streak',
        unlockedAt: new Date('2024-03-10'),
      },
      {
        title: 'Fake News Hunter',
        description: 'Score 100% accuracy in Spot the Fake News',
        unlockedAt: new Date('2024-03-12'),
      },
    ],
  });

  const updateUserStats = (score: number, accuracy: number) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const newXp = prevUser.xp + score;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const leveledUp = newLevel > prevUser.level;
      
      return {
        ...prevUser,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newLevel * 1000,
        stats: {
          ...prevUser.stats,
          gamesPlayed: prevUser.stats.gamesPlayed + 1,
          accuracy: Math.round(((prevUser.stats.accuracy * prevUser.stats.gamesPlayed) + accuracy) / (prevUser.stats.gamesPlayed + 1)),
          totalXp: newXp,
        },
      };
    });
  };

  const addAchievement = (achievement: Achievement) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        achievements: [...prevUser.achievements, achievement],
      };
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUserStats, addAchievement }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}