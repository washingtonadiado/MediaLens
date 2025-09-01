import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Play, FileText, Users, Clock, ChevronRight } from 'lucide-react';

interface LearningHubProps {
  onBack: () => void;
}

export function LearningHub({ onBack }: LearningHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'basics',
      title: 'Media Literacy Basics',
      description: 'Fundamental concepts and principles',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      articles: 5,
      videos: 3
    },
    {
      id: 'deepfakes',
      title: 'Deepfakes & AI',
      description: 'Understanding artificial media',
      icon: Play,
      color: 'from-purple-500 to-purple-600',
      articles: 4,
      videos: 6
    },
    {
      id: 'sources',
      title: 'Source Verification',
      description: 'How to check credibility',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      articles: 6,
      videos: 2
    },
    {
      id: 'social',
      title: 'Social Media',
      description: 'Navigating information online',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      articles: 7,
      videos: 4
    }
  ];

  const featuredContent = [
    {
      type: 'article',
      title: 'The Psychology of Misinformation',
      description: 'Why our brains are wired to believe fake news and how to overcome cognitive biases.',
      readTime: '8 min read',
      difficulty: 'Intermediate',
      image: 'https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg'
    },
    {
      type: 'video',
      title: 'How to Spot Deepfakes',
      description: 'A visual guide to identifying AI-generated videos and images.',
      duration: '12 min',
      difficulty: 'Advanced',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg'
    },
    {
      type: 'case-study',
      title: 'The 2024 Election Misinformation Campaign',
      description: 'Real-world example of how false information spreads during major events.',
      readTime: '15 min read',
      difficulty: 'Expert',
      image: 'https://images.pexels.com/photos/1550340/pexels-photo-1550340.jpeg'
    }
  ];

  const quickTips = [
    {
      title: 'Check Multiple Sources',
      description: 'Always verify information across at least 3 independent sources.',
      icon: '🔍'
    },
    {
      title: 'Look at the URL',
      description: 'Suspicious domains often end in .biz, .info, or have unusual spellings.',
      icon: '🌐'
    },
    {
      title: 'Check Publication Dates',
      description: 'Old news stories are sometimes recirculated as current events.',
      icon: '📅'
    },
    {
      title: 'Reverse Image Search',
      description: 'Use Google Images to find the original source of photos.',
      icon: '📸'
    }
  ];

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Categories
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category?.title}</h1>
            <p className="text-gray-600 mt-2">{category?.description}</p>
          </div>
        </div>

        {/* Category content would go here */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Content Coming Soon</h3>
          <p className="text-gray-600">This category will be filled with comprehensive learning materials.</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
          <p className="text-gray-600 mt-2">Deepen your media literacy knowledge with expert content</p>
        </div>
      </div>

      {/* Featured Content */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Content</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredContent.map((content, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="relative">
                <img 
                  src={content.image} 
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    content.type === 'video' ? 'bg-red-500' :
                    content.type === 'case-study' ? 'bg-purple-500' :
                    'bg-blue-500'
                  }`}>
                    {content.type === 'case-study' ? 'Case Study' : content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{content.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{content.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {content.readTime || content.duration}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    content.difficulty === 'Expert' ? 'bg-red-100 text-red-800' :
                    content.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                    content.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {content.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
            >
              <div className={`bg-gradient-to-r ${category.color} p-3 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{category.articles} articles</span>
                <span>{category.videos} videos</span>
              </div>
              <div className="flex items-center mt-4 text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">Explore</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Quick Tips for Fact-Checking</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickTips.map((tip, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-3">{tip.icon}</div>
              <h3 className="font-bold mb-2">{tip.title}</h3>
              <p className="text-white text-opacity-90 text-sm">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}