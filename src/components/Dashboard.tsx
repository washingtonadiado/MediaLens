import React from 'react';
import { Target, Trophy, BookOpen, Calendar, Flame, Star, TrendingUp, Users } from 'lucide-react';
import { Screen } from '../App';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useUser();
  const { dailyChallenge, weeklyChallenge } = useGame();

  const gameStats = [
    { label: 'Accuracy Rate', value: `${user?.stats.accuracy}%`, icon: Target, color: 'text-green-600' },
    { label: 'Games Played', value: user?.stats.gamesPlayed.toString() || '0', icon: Trophy, color: 'text-blue-600' },
    { label: 'Current Streak', value: `${user?.streak} days`, icon: Flame, color: 'text-orange-600' },
    { label: 'Rank', value: `#${user?.rank}`, icon: TrendingUp, color: 'text-purple-600' },
  ];

  const recentAchievements = user?.achievements.slice(0, 3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">Ready to sharpen your media literacy skills today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {gameStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Daily & Weekly Challenges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">Daily Challenge</h3>
              </div>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                +{dailyChallenge.xpReward} XP
              </span>
            </div>
            <h4 className="text-xl font-bold mb-2">{dailyChallenge.title}</h4>
            <p className="text-blue-100 mb-4">{dailyChallenge.description}</p>
            <button
              onClick={() => onNavigate(dailyChallenge.gameMode as Screen)}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Start Challenge
            </button>
          </div>

          {/* Weekly Challenge */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">Weekly Tournament</h3>
              </div>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                +{weeklyChallenge.xpReward} XP
              </span>
            </div>
            <h4 className="text-xl font-bold mb-2">{weeklyChallenge.title}</h4>
            <p className="text-purple-100 mb-4">{weeklyChallenge.description}</p>
            <button
              onClick={() => onNavigate('games')}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Join Tournament
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('games')}
                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <Target className="h-5 w-5 mr-2" />
                Play Games
              </button>
              <button
                onClick={() => onNavigate('learning-hub')}
                className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Level Progress</h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Level {user?.level}
              </span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{user?.xp} XP</span>
                <span>{user?.nextLevelXp} XP</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((user?.xp || 0) / (user?.nextLevelXp || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
              {recentAchievements.length === 0 && (
                <p className="text-gray-500 text-sm">Complete challenges to earn achievements!</p>
              )}
            </div>
          </div>

          {/* Friends Online */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Friends Online</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Alex Chen</p>
                  <p className="text-xs text-green-600">Playing now</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  S
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Sarah Kim</p>
                  <p className="text-xs text-gray-600">Last seen 2h ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}