import React from 'react';
import { ArrowLeft, Eye, FileText, MousePointer, Search, Clock, Trophy, Target } from 'lucide-react';
import { Screen } from '../App';

interface GameModeSelectorProps {
  onSelectGame: (game: Screen) => void;
  onBack: () => void;
}

export function GameModeSelector({ onSelectGame, onBack }: GameModeSelectorProps) {
  const gameModes = [
    {
      id: 'spot-fake-news',
      title: 'Spot the Fake News',
      description: 'Compare real and fake headlines to test your detection skills',
      icon: FileText,
      color: 'from-red-500 to-red-600',
      difficulty: 'Beginner to Advanced',
      avgTime: '3-5 min',
      badge: 'Most Popular'
    },
    {
      id: 'image-detective',
      title: 'Image Detective',
      description: 'Identify AI-generated and manipulated images using detective skills',
      icon: Eye,
      color: 'from-blue-500 to-blue-600',
      difficulty: 'Intermediate',
      avgTime: '5-7 min',
      badge: 'New!'
    },
    {
      id: 'clickbait-buster',
      title: 'Clickbait Buster',
      description: 'Learn to identify manipulative headlines and thumbnails',
      icon: MousePointer,
      color: 'from-purple-500 to-purple-600',
      difficulty: 'Beginner',
      avgTime: '2-4 min',
      badge: null
    },
    {
      id: 'source-sleuth',
      title: 'Source Sleuth',
      description: 'Investigate source credibility and cross-reference information',
      icon: Search,
      color: 'from-green-500 to-green-600',
      difficulty: 'Advanced',
      avgTime: '7-10 min',
      badge: 'Challenge Mode'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Challenge</h1>
          <p className="text-gray-600 mt-2">Select a game mode to start sharpening your media literacy skills</p>
        </div>
      </div>

      {/* Game Mode Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {gameModes.map((mode) => (
          <div
            key={mode.id}
            className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => onSelectGame(mode.id as Screen)}
          >
            {mode.badge && (
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  mode.badge === 'New!' ? 'bg-green-500' :
                  mode.badge === 'Most Popular' ? 'bg-orange-500' :
                  'bg-purple-500'
                }`}>
                  {mode.badge}
                </span>
              </div>
            )}
            
            {/* Gradient Header */}
            <div className={`bg-gradient-to-r ${mode.color} p-8 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300" />
              <div className="relative z-10">
                <mode.icon className="h-12 w-12 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                <p className="text-white text-opacity-90 leading-relaxed">{mode.description}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">Difficulty:</span>
                  <span className="ml-1">{mode.difficulty}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-medium">Average Time:</span>
                  <span className="ml-1">{mode.avgTime}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:from-gray-900 hover:to-black transition-all duration-300 group-hover:shadow-lg">
                Start Playing
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Weekly Tournament</h2>
          <p className="text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
            Join thousands of players worldwide in our weekly media literacy tournament. 
            Complete challenges across all game modes to climb the leaderboard and win exclusive badges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm opacity-80">Players Joined</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">5 Days</div>
              <div className="text-sm opacity-80">Time Left</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">500 XP</div>
              <div className="text-sm opacity-80">Top Prize</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}