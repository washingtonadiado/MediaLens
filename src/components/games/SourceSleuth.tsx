import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Trophy, ExternalLink, Shield, AlertCircle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';

interface SourceSleuthProps {
  onBack: () => void;
}

interface SourceChallenge {
  id: number;
  title: string;
  website: string;
  url: string;
  aboutInfo: string;
  authorCredentials: string;
  publicationDate: string;
  sources: string[];
  isCredible: boolean;
  credibilityScore: number; // 1-10
  redFlags: string[];
  goodSigns: string[];
  explanation: string;
}

export function SourceSleuth({ onBack }: SourceSleuthProps) {
  const { addGameResult } = useGame();
  const { updateUserStats } = useUser();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'completed'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const challenges: SourceChallenge[] = [
    {
      id: 1,
      title: "Breaking: New COVID-19 Variant Discovered",
      website: "MedicalNewsToday",
      url: "medicalnewstoday.com",
      aboutInfo: "Established medical news site with editorial board of healthcare professionals",
      authorCredentials: "Dr. Sarah Martinez, MD, PhD in Infectious Diseases",
      publicationDate: "March 10, 2024",
      sources: ["CDC", "WHO", "Published research paper", "University health expert interview"],
      isCredible: true,
      credibilityScore: 9,
      redFlags: [],
      goodSigns: ["Established medical publication", "Author with relevant credentials", "Multiple authoritative sources", "Recent date"],
      explanation: "This source demonstrates high credibility with proper medical credentials, authoritative sources, and established publication."
    },
    {
      id: 2,
      title: "Miracle Cure Suppressed by Big Pharma EXPOSED!",
      website: "TruthNews247",
      url: "truthnews247.net",
      aboutInfo: "Alternative news site 'exposing the truth mainstream media won't tell you'",
      authorCredentials: "Mike Johnson, Truth Seeker",
      publicationDate: "February 30, 2024", // Invalid date
      sources: ["Anonymous insider", "Facebook post", "YouTube video"],
      isCredible: false,
      credibilityScore: 2,
      redFlags: ["Suspicious domain", "No real credentials", "Invalid publication date", "Unreliable sources", "Conspiracy language"],
      goodSigns: [],
      explanation: "Multiple red flags: invalid date, poor sources, suspicious domain, and conspiracy-style language indicate low credibility."
    },
    {
      id: 3,
      title: "Climate Report Shows Rising Temperatures Continue",
      website: "BBC News",
      url: "bbc.com/news",
      aboutInfo: "British public service broadcaster with global news coverage",
      authorCredentials: "Environment Correspondent with 15 years experience",
      publicationDate: "March 8, 2024",
      sources: ["NASA climate data", "IPCC report", "Multiple climate scientists quoted"],
      isCredible: true,
      credibilityScore: 10,
      redFlags: [],
      goodSigns: ["Reputable news organization", "Experienced journalist", "Authoritative scientific sources", "Multiple expert quotes"],
      explanation: "BBC is a well-established, credible news organization with proper sourcing and experienced journalists."
    },
    {
      id: 4,
      title: "Local Celebrity Secret Diet - Lose 50lbs in 2 Weeks!",
      website: "DietSecrets",
      url: "diet-secrets-now.biz",
      aboutInfo: "Your source for celebrity weight loss secrets",
      authorCredentials: "Weight Loss Expert (no specific qualifications listed)",
      publicationDate: "March 1, 2024",
      sources: ["Celebrity Instagram", "Anonymous friend", "Before/after photos"],
      isCredible: false,
      credibilityScore: 3,
      redFlags: [".biz domain raises questions", "Vague credentials", "Unrealistic claims", "Poor source quality", "Commercial intent"],
      goodSigns: ["Recent date"],
      explanation: "Unrealistic health claims, poor sourcing, suspicious domain, and lack of proper credentials indicate low credibility."
    }
  ];

  const currentSource = challenges[currentChallenge];

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

  const handleAnswer = (isCredible: boolean) => {
    const correct = isCredible === currentSource.isCredible;
    setSelectedAnswer(isCredible);
    
    if (correct) {
      setScore(score + 20);
    } else {
      setLives(lives - 1);
    }
    
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1 && lives > 0) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeLeft(60);
      setGameState('playing');
      setSelectedAnswer(null);
    } else {
      setGameState('completed');
      const accuracy = Math.round((score / (challenges.length * 20)) * 100);
      addGameResult({
        gameMode: 'source-sleuth',
        score,
        accuracy,
        timeSpent: challenges.length * 60 - timeLeft,
      });
      updateUserStats(score, accuracy);
    }
  };

  const handleRestart = () => {
    setCurrentChallenge(0);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setGameState('playing');
    setSelectedAnswer(null);
  };

  if (gameState === 'completed') {
    const accuracy = Math.round((score / (challenges.length * 20)) * 100);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Investigation Complete!</h2>
          <p className="text-gray-600 mb-6">Your source evaluation results:</p>
          
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
              className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Investigate Again
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-2xl font-bold text-gray-900">Source Sleuth</h1>
          <p className="text-gray-600">Investigation {currentChallenge + 1} of {challenges.length}</p>
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
      <div className="mb-8">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-lg font-medium">{timeLeft}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>
      </div>

      {gameState === 'playing' && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Evaluate this source's CREDIBILITY</h2>
            <p className="text-gray-600">Analyze all available information to determine if this is a reliable source</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Source Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Article Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{currentSource.title}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium">Website:</span>
                    <span className="ml-2 text-blue-600">{currentSource.website}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">URL:</span>
                    <span className="ml-2 text-gray-600">{currentSource.url}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mt-1">Publication Date:</span>
                    <span className="ml-2 text-gray-600">{currentSource.publicationDate}</span>
                  </div>
                </div>
              </div>

              {/* About & Credentials */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="font-bold text-gray-900 mb-3">About the Source</h4>
                <p className="text-gray-700 mb-4">{currentSource.aboutInfo}</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-bold text-blue-900 mb-2">Author Credentials:</h5>
                  <p className="text-blue-800">{currentSource.authorCredentials}</p>
                </div>
              </div>

              {/* Sources & References */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="font-bold text-gray-900 mb-3">Sources Referenced:</h4>
                <ul className="space-y-2">
                  {currentSource.sources.map((source, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="h-2 w-2 bg-gray-400 rounded-full mr-3" />
                      {source}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decision Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  CREDIBLE SOURCE
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 bg-red-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  NOT CREDIBLE
                </button>
              </div>
            </div>

            {/* Evaluation Guide */}
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-3">Signs of Credibility:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Established publication</li>
                  <li>• Author expertise</li>
                  <li>• Multiple reliable sources</li>
                  <li>• Recent, accurate dates</li>
                  <li>• Clear methodology</li>
                  <li>• Balanced reporting</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-3">Red Flags:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Unknown/suspicious domains</li>
                  <li>• Anonymous authors</li>
                  <li>• Poor or no sources</li>
                  <li>• Extreme bias or emotion</li>
                  <li>• Impossible dates</li>
                  <li>• Commercial interests</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-3">Quick Checks:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Who is the author?</li>
                  <li>• What's the publication?</li>
                  <li>• When was it published?</li>
                  <li>• Where do they get info?</li>
                  <li>• Why was it written?</li>
                  <li>• How does it compare?</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">Credibility Scale</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Not Credible</span>
                    <span>Highly Credible</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>1-3</span>
                    <span>4-6</span>
                    <span>7-10</span>
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
                  <h3 className="text-xl font-bold text-gray-900">Investigation Timeout!</h3>
                  <p className="text-gray-600">You ran out of time to evaluate</p>
                </div>
              </div>
            ) : selectedAnswer === currentSource.isCredible ? (
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-green-700">Excellent Investigation!</h3>
                  <p className="text-gray-600">+20 points</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center mb-4">
                <XCircle className="h-12 w-12 text-red-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-red-700">Incorrect Assessment</h3>
                  <p className="text-gray-600">-1 life</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-3">Source Analysis:</h4>
              <p className="text-blue-800 mb-4">{currentSource.explanation}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-blue-700 mr-2">Credibility Score:</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentSource.credibilityScore <= 3 ? 'bg-red-500' :
                          currentSource.credibilityScore <= 6 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${currentSource.credibilityScore * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-800">
                      {currentSource.credibilityScore}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {currentSource.redFlags.length > 0 && (
                <div className="bg-red-50 rounded-lg p-6">
                  <h4 className="font-bold text-red-900 mb-3">Red Flags Identified:</h4>
                  <ul className="text-red-800 space-y-1">
                    {currentSource.redFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentSource.goodSigns.length > 0 && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-green-900 mb-3">Positive Indicators:</h4>
                  <ul className="text-green-800 space-y-1">
                    {currentSource.goodSigns.map((sign, index) => (
                      <li key={index}>• {sign}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleNext}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              {lives <= 0 ? 'View Results' : currentChallenge < challenges.length - 1 ? 'Next Investigation' : 'View Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}