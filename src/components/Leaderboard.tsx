import React, { useState } from 'react';
import { ArrowLeft, Trophy, Medal, Crown, TrendingUp, Users, Star } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface LeaderboardProps {
  onBack: () => void;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  accuracy: number;
  streak: number;
  badge?: string;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'weekly'>('global');

  const globalLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'TruthSeeker99', level: 12, xp: 12450, accuracy: 94, streak: 28, badge: 'Champion' },
    { rank: 2, username: 'FactChecker', level: 11, xp: 11230, accuracy: 92, streak: 15, badge: 'Master' },
    { rank: 3, username: 'NewsNinja', level: 10, xp: 10890, accuracy: 89, streak: 22, badge: 'Expert' },
    { rank: 4, username: 'MediaMaven', level: 9, xp: 9650, accuracy: 91, streak: 12 },
    { rank: 5, username: 'InfoGuard', level: 9, xp: 9420, accuracy: 88, streak: 8 },
    { rank: 6, username: 'SkepticalSam', level: 8, xp: 8750, accuracy: 87, streak: 19 },
    { rank: 7, username: 'DetectiveDana', level: 8, xp: 8520, accuracy: 90, streak: 5 },
    { rank: 8, username: 'CriticalThinker', level: 7, xp: 7890, accuracy: 86, streak: 14 },
    // ... user's position
    { rank: 142, username: user?.username || 'MediaMaster', level: user?.level || 3, xp: user?.xp || 850, accuracy: user?.stats.accuracy || 78, streak: user?.streak || 7 },
  ];

  const friendsLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'Alex Chen', level: 5, xp: 4250, accuracy: 82, streak: 12 },
    { rank: 2, username: user?.username || 'MediaMaster', level: user?.level || 3, xp: user?.xp || 850, accuracy: user?.stats.accuracy || 78, streak: user?.streak || 7 },
    { rank: 3, username: 'Sarah Kim', level: 2, xp: 1890, accuracy: 75, streak: 3 },
  ];

  const weeklyLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'WeeklyWarrior', level: 6, xp: 1250, accuracy: 93, streak: 7, badge: 'This Week' },
    { rank: 2, username: 'SpeedRunner', level: 4, xp: 980, accuracy: 88, streak: 6 },
    { rank: 3, username: user?.username || 'MediaMaster', level: user?.level || 3, xp: 750, accuracy: user?.stats.accuracy || 78, streak: 5 },
  ];

  const getCurrentLeaderboard = () => {
    switch (activeTab) {
      case 'friends': return friendsLeaderboard;
      case 'weekly': return weeklyLeaderboard;
      default: return globalLeaderboard;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-6 w-6 text-orange-500" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Champion': return 'bg-yellow-500 text-white';
      case 'Master': return 'bg-purple-500 text-white';
      case 'Expert': return 'bg-blue-500 text-white';
      case 'This Week': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-2">See how you stack up against other media literacy champions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'global' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Global
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'friends' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          Friends
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'weekly' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Star className="h-4 w-4 mr-2" />
          This Week
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <h2 className="text-xl font-bold">
            {activeTab === 'global' && 'Global Rankings'}
            {activeTab === 'friends' && 'Friends Rankings'}
            {activeTab === 'weekly' && 'Weekly Tournament'}
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {getCurrentLeaderboard().map((entry) => (
            <div
              key={entry.rank}
              className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                entry.username === user?.username ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                    entry.username === user?.username ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-500'
                  }`}>
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{entry.username}</span>
                      {entry.username === user?.username && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">You</span>
                      )}
                      {entry.badge && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(entry.badge)}`}>
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Level {entry.level}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{entry.xp.toLocaleString()}</div>
                  <div className="text-gray-600">XP</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{entry.accuracy}%</div>
                  <div className="text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{entry.streak}</div>
                  <div className="text-gray-600">Streak</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Stats Summary */}
      {user && (
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Your Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">#{user.rank}</div>
                <div className="text-blue-100">Global Rank</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{user.stats.accuracy}%</div>
                <div className="text-blue-100">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{user.streak}</div>
                <div className="text-blue-100">Day Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{user.xp}</div>
                <div className="text-blue-100">Total XP</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}