import React, { useState } from 'react';
import { MessageSquare, Brain, Zap, PlayCircle, Clock, Star } from 'lucide-react';
import Card from '../components/Card';

interface Question {
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleAnswer: string;
  tips: string[];
}

const InterviewCoach: React.FC = () => {
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const handleGenerateQuestions = async () => {
    if (!jobRole.trim()) {
      alert('Please enter a job role');
      return;
    }

    setIsGenerating(true);
    setQuestions([]);
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem('token'); // Assumes JWT is stored here after login
      const response = await fetch(`${BASE_URL}/api/generate-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ jobRole, jobDescription })
      });
      if (!response.ok) {
        throw new Error('Failed to generate interview questions');
      }
      const data = await response.json();
      // Adapt to your backend's response structure
      if (Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else if (Array.isArray(data.interview)) {
        setQuestions(data.interview);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      alert('Error generating questions: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4 mr-2" />
            AI Interview Coach
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interview Preparation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice with AI-generated interview questions tailored to your target role. Build confidence and improve your responses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                Job Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Paste the job description for more targeted questions..."
                  />
                </div>

                <button
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating || !jobRole.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Questions
                    </>
                  )}
                </button>
              </div>
            </Card>

            {questions.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Practice Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Clock className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                    Take time to think before answering
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                    Use specific examples from your experience
                  </li>
                  <li className="flex items-start">
                    <PlayCircle className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                    Practice out loud for better fluency
                  </li>
                </ul>
              </Card>
            )}
          </div>

          {/* Questions Section */}
          <div className="lg:col-span-2">
            {questions.length === 0 && !isGenerating && (
              <Card className="p-12 text-center bg-gradient-to-br from-purple-50 to-indigo-50">
                <MessageSquare className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Practice?
                </h3>
                <p className="text-gray-600">
                  Enter your target job role to get personalized interview questions
                </p>
              </Card>
            )}

            {questions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Interview Questions for {jobRole}
                </h2>
                
                {questions.map((question, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className="text-sm text-gray-500">
                              {question.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {question.question}
                          </h3>
                        </div>
                        <div className="ml-4">
                          <PlayCircle className={`w-5 h-5 transition-transform ${selectedQuestion === index ? 'rotate-90' : ''} text-purple-600`} />
                        </div>
                      </div>
                    </div>

                    {selectedQuestion === index && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Sample Answer:</h4>
                          <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border">
                            {question.sampleAnswer}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Tips for Success:</h4>
                          <ul className="space-y-2">
                            {question.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                                <Star className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}

                <Card className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <div className="text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-purple-200" />
                    <h3 className="text-lg font-semibold mb-2">
                      Want More Personalized Practice?
                    </h3>
                    <p className="text-purple-100 mb-4">
                      Get unlimited AI-generated questions and detailed feedback with our premium plans
                    </p>
                    <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                      Upgrade Now
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCoach;