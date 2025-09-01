import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';

interface SpotFakeNewsProps {
  onBack: () => void;
}

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  date: string;
  author: string;
  isReal: boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function SpotFakeNews({ onBack }: SpotFakeNewsProps) {
  const { addGameResult } = useGame();
  const { user, updateUserStats } = useUser();
  const [currentPair, setCurrentPair] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'completed'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const newsItems: NewsItem[] = [
    {
      id: 1,
      headline: "Local School District Receives $2M Grant for STEM Education",
      source: "City Times",
      date: "March 15, 2024",
      author: "Sarah Johnson",
      isReal: true,
      explanation: "This is a legitimate news story with verifiable details: specific amount, clear purpose, and credible local source.",
      difficulty: 'easy'
    },
    {
      id: 2,
      headline: "Scientists Discover Unicorns Living in Remote Amazon Forest",
      source: "BreakingNewsNow.net",
      date: "March 15, 2024",
      author: "Anonymous",
      isReal: false,
      explanation: "Red flags: mythical creature claim, suspicious domain (.net), anonymous author, and no scientific backing.",
      difficulty: 'easy'
    },
    {
      id: 3,
      headline: "New Study Shows 90% Reduction in Heart Disease with Daily Chocolate",
      source: "Medical Journal Today",
      date: "March 14, 2024",
      author: "Dr. Amanda Chen",
      isReal: false,
      explanation: "While the source sounds credible, the claim is too good to be true. Legitimate medical studies show modest benefits, not 90% reductions.",
      difficulty: 'medium'
    },
    {
      id: 4,
      headline: "Climate Change Summit Addresses Rising Sea Levels",
      source: "Reuters",
      date: "March 13, 2024",
      author: "Environmental Correspondent",
      isReal: true,
      explanation: "Reuters is a reputable news agency, the topic is current and factual, and the author has appropriate credentials.",
      difficulty: 'medium'
    }
  ];

  const currentNews = newsItems[currentPair];
  const fakeNews = newsItems.find(item => !item.isReal && item.id !== currentNews?.id);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, gameState]);

  const handleTimeUp = () => {
    setLives(lives - 1);
    setGameState('feedback');
    setSelectedAnswer(null);
  };

  const handleAnswer = (isRealChoice: boolean) => {
    const correct = isRealChoice === currentNews.isReal;
    setSelectedAnswer(isRealChoice ? 1 : 0);
    
    if (correct) {
      setScore(score + 10);
    } else {
      setLives(lives - 1);
    }
    
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentPair < newsItems.length - 2 && lives > 0) {
      setCurrentPair(currentPair + 2);
      setTimeLeft(30);
      setGameState('playing');
      setSelectedAnswer(null);
      setShowHint(false);
    } else {
      setGameState('completed');
      const accuracy = Math.round((score / ((currentPair / 2 + 1) * 10)) * 100);
      addGameResult({
        gameMode: 'spot-fake-news',
        score,
        accuracy,
        timeSpent: (newsItems.length / 2) * 30 - timeLeft,
      });
      updateUserStats(score, accuracy);
    }
  };

  const handleRestart = () => {
    setCurrentPair(0);
    setScore(0);
    setLives(3);
    setTimeLeft(30);
    setGameState('playing');
    setSelectedAnswer(null);
    setShowHint(false);
  };

  if (gameState === 'completed') {
    const accuracy = Math.round((score / (newsItems.length / 2 * 10)) * 100);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-gray-600 mb-6">Here are your results:</p>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">+{score}</div>
              <div className="text-sm text-gray-600">XP Earned</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Spot the Fake News</h1>
          <p className="text-gray-600">Round {Math.floor(currentPair / 2) + 1} of {Math.floor(newsItems.length / 2)}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">Score: {score}</div>
          <div className="flex items-center text-red-600">
            {Array.from({ length: lives }, (_, i) => (
              <div key={i} className="h-2 w-2 bg-red-500 rounded-full mr-1" />
            ))}
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-lg font-medium">{timeLeft}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {gameState === 'playing' && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Which headline is REAL?</h2>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center mx-auto"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              {showHint ? 'Hide' : 'Show'} Hint
            </button>
          </div>

          {showHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Hint:</strong> Look for credible sources, reasonable claims, named authors, and recent dates. 
                Be suspicious of anonymous authors, extraordinary claims, and unfamiliar websites.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Option A */}
            <button
              onClick={() => handleAnswer(true)}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Option A</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{currentNews?.headline}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Source:</strong> {currentNews?.source}</div>
                <div><strong>Date:</strong> {currentNews?.date}</div>
                <div><strong>Author:</strong> {currentNews?.author}</div>
              </div>
            </button>

            {/* Option B */}
            <button
              onClick={() => handleAnswer(false)}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Option B</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{fakeNews?.headline}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Source:</strong> {fakeNews?.source}</div>
                <div><strong>Date:</strong> {fakeNews?.date}</div>
                <div><strong>Author:</strong> {fakeNews?.author}</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {gameState === 'feedback' && (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-6">
            {selectedAnswer === null ? (
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-12 w-12 text-orange-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Time's Up!</h3>
                  <p className="text-gray-600">You ran out of time</p>
                </div>
              </div>
            ) : selectedAnswer === (currentNews?.isReal ? 1 : 0) ? (
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-green-700">Correct!</h3>
                  <p className="text-gray-600">+10 points</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center mb-4">
                <XCircle className="h-12 w-12 text-red-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-red-700">Incorrect</h3>
                  <p className="text-gray-600">-1 life</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-blue-900 mb-2">Explanation:</h4>
            <p className="text-blue-800">{currentNews?.explanation}</p>
          </div>

          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {lives <= 0 ? 'View Results' : currentPair < newsItems.length - 2 ? 'Next Round' : 'View Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}