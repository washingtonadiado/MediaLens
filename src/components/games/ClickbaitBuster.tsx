import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';

interface ClickbaitBusterProps {
  onBack: () => void;
}

interface HeadlineChallenge {
  id: number;
  headline: string;
  isClickbait: boolean;
  explanation: string;
  clickbaitScore: number; // 1-10 scale
  techniques: string[];
  legitimateVersion?: string;
}

export function ClickbaitBuster({ onBack }: ClickbaitBusterProps) {
  const { addGameResult } = useGame();
  const { updateUserStats } = useUser();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'completed'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const challenges: HeadlineChallenge[] = [
    {
      id: 1,
      headline: "You Won't BELIEVE What This Celebrity Did Next! (SHOCKING)",
      isClickbait: true,
      explanation: "Classic clickbait using emotional hooks, vague promises, and excessive punctuation to manipulate curiosity.",
      clickbaitScore: 10,
      techniques: ["Vague promises", "Emotional manipulation", "Excessive capitalization", "Curiosity gap"],
      legitimateVersion: "Celebrity Donates $1 Million to Local Charity"
    },
    {
      id: 2,
      headline: "Local School Board Approves $5M Budget for New Science Labs",
      isClickbait: false,
      explanation: "This is legitimate journalism: specific, factual, and informative without emotional manipulation.",
      clickbaitScore: 1,
      techniques: []
    },
    {
      id: 3,
      headline: "Doctors HATE This One Simple Trick That Will Change Your Life Forever",
      isClickbait: true,
      explanation: "Uses authority figures, promises of easy solutions, and exaggerated claims to generate clicks.",
      clickbaitScore: 9,
      techniques: ["False authority claims", "Oversimplified solutions", "Exaggerated promises", "Us vs. them mentality"],
      legitimateVersion: "Study Shows Regular Exercise Reduces Health Risks"
    },
    {
      id: 4,
      headline: "Housing Market Shows 3% Growth in Q3, Experts Remain Cautious",
      isClickbait: false,
      explanation: "Factual reporting with specific data and balanced perspective from experts.",
      clickbaitScore: 2,
      techniques: []
    },
    {
      id: 5,
      headline: "This Mom's Grocery Shopping Hack Will Save You THOUSANDS!!! Click to See How!",
      isClickbait: true,
      explanation: "Combines personal anecdotes, exaggerated savings claims, and direct call-to-action for maximum click appeal.",
      clickbaitScore: 8,
      techniques: ["Personal anecdotes", "Exaggerated claims", "Direct CTA", "Multiple exclamation marks"],
      legitimateVersion: "Budget-Conscious Families Share Money-Saving Shopping Tips"
    }
  ];

  const currentHeadline = challenges[currentChallenge];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gameState]);

  const handleTimeUp = () => {
    setLives(lives - 1);
    setGameState('feedback');
    setSelectedAnswer(null);
  };

  const handleAnswer = (isClickbait: boolean) => {
    const correct = isClickbait === currentHeadline.isClickbait;
    setSelectedAnswer(isClickbait);
    
    if (correct) {
      setScore(score + 12);
    } else {
      setLives(lives - 1);
    }
    
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1 && lives > 0) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeLeft(25);
      setGameState('playing');
      setSelectedAnswer(null);
    } else {
      setGameState('completed');
      const accuracy = Math.round((score / (challenges.length * 12)) * 100);
      addGameResult({
        gameMode: 'clickbait-buster',
        score,
        accuracy,
        timeSpent: challenges.length * 25 - timeLeft,
      });
      updateUserStats(score, accuracy);
    }
  };

  const handleRestart = () => {
    setCurrentChallenge(0);
    setScore(0);
    setLives(3);
    setTimeLeft(25);
    setGameState('playing');
    setSelectedAnswer(null);
  };

  if (gameState === 'completed') {
    const accuracy = Math.round((score / (challenges.length * 12)) * 100);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Clickbait Busted!</h2>
          <p className="text-gray-600 mb-6">Your headline analysis results:</p>
          
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
              className="flex items-center justify-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Bust More Clickbait
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
          <h1 className="text-2xl font-bold text-gray-900">Clickbait Buster</h1>
          <p className="text-gray-600">Headline {currentChallenge + 1} of {challenges.length}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">Score: {score}</div>
          <div className="flex items-center justify-end text-red-600">
            {Array.from({ length: lives }, (_, i) => (
              <div key={i} className="h-2 w-2 bg-red-500 rounded-full mr-1" />
            ))}
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-5 w-5 text-purple-600 mr-2" />
          <span className="text-lg font-medium">{timeLeft}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 25) * 100}%` }}
          />
        </div>
      </div>

      {gameState === 'playing' && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Is this headline CLICKBAIT?</h2>
            <p className="text-gray-600">Look for emotional manipulation, vague promises, and exaggerated claims</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Headline Display */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    "{currentHeadline.headline}"
                  </h3>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    ✓ LEGITIMATE
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 bg-red-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    ✗ CLICKBAIT
                  </button>
                </div>
              </div>
            </div>

            {/* Detection Guide */}
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <h4 className="font-bold text-orange-800">Clickbait Warning Signs:</h4>
                </div>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Vague, mysterious promises</li>
                  <li>• Emotional manipulation</li>
                  <li>• "You won't believe..." phrases</li>
                  <li>• Excessive punctuation!!!</li>
                  <li>• Numbers without context</li>
                  <li>• "This one trick..." claims</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-3">Legitimate Headlines:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Specific and factual</li>
                  <li>• Include relevant details</li>
                  <li>• Use neutral language</li>
                  <li>• Provide clear context</li>
                  <li>• Don't overpromise</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">Clickbait Scale</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Legitimate</span>
                    <span>Extreme Clickbait</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>1-2</span>
                    <span>3-5</span>
                    <span>6-8</span>
                    <span>9-10</span>
                  </div>
                </div>
              </div>
            </div>
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
                  <p className="text-gray-600">You ran out of time to analyze</p>
                </div>
              </div>
            ) : selectedAnswer === currentHeadline.isClickbait ? (
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-green-700">Correct Analysis!</h3>
                  <p className="text-gray-600">+12 points</p>
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

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-3">Analysis:</h4>
              <p className="text-blue-800 mb-3">{currentHeadline.explanation}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-blue-700 mr-2">Clickbait Score:</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentHeadline.clickbaitScore <= 3 ? 'bg-green-500' :
                          currentHeadline.clickbaitScore <= 6 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${currentHeadline.clickbaitScore * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-800">
                      {currentHeadline.clickbaitScore}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {currentHeadline.techniques.length > 0 && (
              <div className="bg-red-50 rounded-lg p-6">
                <h4 className="font-bold text-red-900 mb-3">Clickbait Techniques Used:</h4>
                <ul className="text-red-800 space-y-1">
                  {currentHeadline.techniques.map((technique, index) => (
                    <li key={index}>• {technique}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentHeadline.legitimateVersion && (
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-bold text-green-900 mb-3">How a Legitimate Version Might Look:</h4>
                <p className="text-green-800 italic">"{currentHeadline.legitimateVersion}"</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleNext}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {lives <= 0 ? 'View Results' : currentChallenge < challenges.length - 1 ? 'Next Headline' : 'View Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}