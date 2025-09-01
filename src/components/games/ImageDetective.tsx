import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Trophy, Eye, ZoomIn } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';

interface ImageDetectiveProps {
  onBack: () => void;
}

interface ImageChallenge {
  id: number;
  title: string;
  explanation: string;
  redFlags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'single' | 'comparison';
  imageUrl?: string;
  isReal?: boolean;
  comparisonImages?: { url: string; isReal: boolean }[];
}

export function ImageDetective({ onBack }: ImageDetectiveProps) {
  const { addGameResult } = useGame();
  const { updateUserStats } = useUser();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'completed'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const challenges: ImageChallenge[] = [
    {
      id: 1,
      type: 'single',
      imageUrl: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg",
      isReal: true,
      title: "Street Photography",
      explanation: "This is a genuine photograph with natural lighting, realistic shadows, and consistent image quality throughout.",
      redFlags: [],
      difficulty: 'easy'
    },
    {
      id: 2,
      type: 'single',
      imageUrl: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      isReal: false,
      title: "Portrait with Unusual Lighting",
      explanation: "While this appears to be a real photo, AI-generated images often have subtle inconsistencies in lighting and facial features.",
      redFlags: ["Unusual light reflection in eyes", "Overly smooth skin texture", "Inconsistent shadow directions"],
      difficulty: 'medium'
    },
    {
        id: 3,
        type: 'comparison',
        title: "Which Portrait is Real?",
        explanation: "The image on the right shows signs of AI generation, such as unnatural skin texture and inconsistent background details. The image on the left is a real photograph.",
        redFlags: ["Unnatural skin texture", "Inconsistent background", "Asymmetrical features"],
        difficulty: 'hard',
        comparisonImages: [
          { url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", isReal: true },
          { url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg", isReal: false }
        ]
    },
    {
      id: 4,
      type: 'comparison',
      title: "Which Sunrise is Real?",
      explanation: "The AI-generated sunset on the right has an overly vibrant and dramatic sky that is uncommon in real life. The real sunrise on the left has more natural lighting and cloud patterns.",
      redFlags: ["Exaggerated colors", "Unrealistic lighting", "Perfectly smooth gradients"],
      difficulty: 'medium',
      comparisonImages: [
        { url: "../../../Public/sunrise_REAL.webp", isReal: true },
        { url: "../../../Public/sunset_AI.png", isReal: false }
      ]
    },
    {
      id: 5,
      type: 'comparison',
      title: "Which of these depicts a real event?",
      explanation: "The image on the right is AI-generated. While it looks realistic, it depicts an event that did not happen. The image on the left is a real photo of a real event.",
      redFlags: ["Contextual clues", "Unusual details in the crowd", "Source verification"],
      difficulty: 'hard',
      comparisonImages: [
        { url: "../../../Public/tatizo_REAL.webp", isReal: true },
        { url: "../../../Public/tatizo_AI.png", isReal: false }
      ]
    },
    {
      id: 6,
      type: 'single',
      imageUrl: "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg",
      isReal: true,
      title: "Architecture Photography",
      explanation: "Architectural photography like this is typically real, with consistent perspective lines and realistic lighting on building surfaces.",
      redFlags: [],
      difficulty: 'easy'
    },
    {
      id: 7,
      type: 'single',
      imageUrl: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg",
      isReal: false,
      title: "Perfect Portrait",
      explanation: "This image shows telltale signs of AI generation: overly perfect features, unnatural skin smoothness, and inconsistent background elements.",
      redFlags: ["Too-perfect facial symmetry", "Unnatural skin texture", "Blurred background inconsistencies"],
      difficulty: 'hard'
    }
  ];

  const currentImg = challenges[currentChallenge];

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

  const handleAnswer = (isReal: boolean) => {
    const correct = isReal === currentImg.isReal;
    setSelectedAnswer(isReal);
    
    if (correct) {
      setScore(score + 15);
    } else {
      setLives(lives - 1);
    }
    
    setGameState('feedback');
  };

  const handleComparisonAnswer = (isReal: boolean) => {
    setSelectedAnswer(isReal);
    if (isReal) {
      setScore(score + 25);
    } else {
      setLives(lives - 1);
    }
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1 && lives > 0) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeLeft(45);
      setGameState('playing');
      setSelectedAnswer(null);
    } else {
      setGameState('completed');
      const accuracy = Math.round((score / (challenges.length * 15)) * 100);
      addGameResult({
        gameMode: 'image-detective',
        score,
        accuracy,
        timeSpent: challenges.length * 45 - timeLeft,
      });
      updateUserStats(score, accuracy);
    }
  };

  const handleRestart = () => {
    setCurrentChallenge(0);
    setScore(0);
    setLives(3);
    setTimeLeft(45);
    setGameState('playing');
    setSelectedAnswer(null);
  };

  if (gameState === 'completed') {
    const accuracy = Math.round((score / (challenges.length * 15)) * 100);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Detective Work Complete!</h2>
          <p className="text-gray-600 mb-6">Your image analysis skills:</p>
          
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
              Analyze Again
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
          <h1 className="text-2xl font-bold text-gray-900">Image Detective</h1>
          <p className="text-gray-600">Case {currentChallenge + 1} of {challenges.length}</p>
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
          <Clock className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-lg font-medium">{timeLeft}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 45) * 100}%` }}
          />
        </div>
      </div>

      {gameState === 'playing' && (
        <div>
          {currentImg.type === 'single' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Is this image REAL or AI-GENERATED?</h2>
                <p className="text-gray-600">Look for inconsistencies, unnatural elements, and digital artifacts</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Image */}
                <div className="lg:col-span-2">
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                      src={currentImg.imageUrl} 
                      alt={currentImg.title}
                      className="w-full h-96 object-cover"
                    />
                    <button
                      onClick={() => setZoomedImage(currentImg.imageUrl ?? null)}
                      className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <ZoomIn className="h-5 w-5 text-gray-700" />
                    </button>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{currentImg.title}</h3>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        Difficulty: <span className="ml-1 capitalize">{currentImg.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">Detection Tips:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Check for unnatural lighting</li>
                      <li>• Look at facial features and symmetry</li>
                      <li>• Examine background consistency</li>
                      <li>• Notice texture and skin appearance</li>
                      <li>• Check for digital artifacts</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      ✓ REAL IMAGE
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      ✗ AI-GENERATED
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentImg.type === 'comparison' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Which image is REAL?</h2>
                <p className="text-gray-600">Click on the image you believe is the genuine photograph.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentImg.comparisonImages?.map((image, index) => (
                  <div key={index} className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer" onClick={() => handleComparisonAnswer(image.isReal)}>
                    <img 
                      src={image.url} 
                      alt={`Comparison image ${index + 1}`}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="font-bold text-white text-lg">Image {index + 1}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            ) : selectedAnswer ? (
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-green-700">Excellent Detection!</h3>
                  <p className="text-gray-600">+ {currentImg.type === 'comparison' ? 25 : 15} points</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center mb-4">
                <XCircle className="h-12 w-12 text-red-500 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-red-700">Incorrect Analysis</h3>
                  <p className="text-gray-600">-1 life</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-blue-900 mb-3">Analysis Explanation:</h4>
            <p className="text-blue-800 mb-4">{currentImg.explanation}</p>
            
            {currentImg.redFlags.length > 0 && (
              <div>
                <h5 className="font-bold text-blue-900 mb-2">Red Flags to Notice:</h5>
                <ul className="text-blue-800 space-y-1">
                  {currentImg.redFlags.map((flag, index) => (
                    <li key={index}>• {flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {lives <= 0 ? 'View Results' : currentChallenge < challenges.length - 1 ? 'Next Case' : 'View Results'}
            </button>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={zoomedImage} 
              alt="Zoomed view"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}