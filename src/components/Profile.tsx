import React from 'react';
import { ArrowLeft, Star, Trophy, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">Level {user.level}</span>
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-blue-600 mb-1">
                    <span>{user.xp} XP</span>
                    <span>{user.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-700">{user.streak}</div>
                  <div className="text-xs text-green-600">Day Streak</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-700">#{user.rank}</div>
                  <div className="text-xs text-purple-600">Global Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Game Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Game Statistics</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{user.stats.accuracy}%</div>
                <div className="text-sm text-gray-600">Average Accuracy</div>
              </div>
              <div className="text-center">
                <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{user.stats.gamesPlayed}</div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{user.stats.totalXp}</div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Achievements</h3>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {user.achievements.length} earned
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="bg-yellow-500 p-2 rounded-full mr-3 flex-shrink-0">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Locked Achievements Preview */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Coming Soon</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-60">
                  <div className="flex items-start">
                    <div className="bg-gray-400 p-2 rounded-full mr-3 flex-shrink-0">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-700 mb-1">Perfect Week</h4>
                      <p className="text-sm text-gray-500">Complete daily challenges for 7 days straight</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-60">
                  <div className="flex items-start">
                    <div className="bg-gray-400 p-2 rounded-full mr-3 flex-shrink-0">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-700 mb-1">Sharpshooter</h4>
                      <p className="text-sm text-gray-500">Achieve 95% accuracy across 10 games</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full mr-3">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Completed Spot the Fake News</p>
                    <p className="text-sm text-gray-600">Scored 85% accuracy</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 rounded-full mr-3">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Unlocked Achievement</p>
                    <p className="text-sm text-gray-600">Fake News Hunter</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="bg-purple-500 p-2 rounded-full mr-3">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Leveled Up!</p>
                    <p className="text-sm text-gray-600">Reached Level 3</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}