import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Zap, Target, Brain, ArrowRight } from 'lucide-react';
import Card from '../components/Card';

interface AnalysisResult {
  grammar: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  skills: {
    matched: string[];
    missing: string[];
    suggestions: string[];
  };
  tailoring: {
    score: number;
    recommendations: string[];
  };
}

const ResumeAnalyzer: React.FC = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!resume.trim()) {
      alert('Please paste your resume content');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        grammar: {
          score: 85,
          issues: [
            'Line 3: "Experienced in developing" should be "Experienced in development"',
            'Line 12: Missing comma after "Additionally"'
          ],
          suggestions: [
            'Use active voice throughout your resume',
            'Ensure consistent tense usage',
            'Add action verbs to bullet points'
          ]
        },
        skills: {
          matched: ['JavaScript', 'React', 'Node.js', 'Git'],
          missing: ['TypeScript', 'AWS', 'Docker', 'Agile'],
          suggestions: [
            'Add TypeScript to your technical skills section',
            'Mention AWS experience if you have any',
            'Include Docker and containerization experience'
          ]
        },
        tailoring: {
          score: 72,
          recommendations: [
            'Add more specific metrics and achievements',
            'Include industry-specific keywords',
            'Align your experience section with job requirements',
            'Add a professional summary section'
          ]
        }
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // In a real app, you'd extract text from PDF
      setResume('PDF content would be extracted here...\n\nJohn Doe\nSoftware Engineer\n\nExperience:\n- Developed web applications using React and Node.js\n- Collaborated with cross-functional teams\n- Implemented responsive designs');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Analysis
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant feedback on your resume with AI-powered analysis. Improve your chances of landing your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Resume Content
              </h2>
              
              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF Resume
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drag & drop your resume here</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or paste your resume text
                </label>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Paste your resume content here..."
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Job Description (Optional)
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste the job description to get tailored feedback..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Adding a job description helps us provide more targeted suggestions
              </p>
            </Card>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resume.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!analysisResult && !isAnalyzing && (
              <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-gray-600">
                  Upload or paste your resume to get started with AI-powered feedback
                </p>
              </Card>
            )}

            {analysisResult && (
              <>
                {/* Grammar & Language */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Grammar & Language
                    </h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">
                        {analysisResult.grammar.score}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Issues Found:</h4>
                      <ul className="space-y-1">
                        {analysisResult.grammar.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <AlertCircle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">Suggestions:</h4>
                      <ul className="space-y-1">
                        {analysisResult.grammar.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Skills Match */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Skills Match & Keywords
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Matched Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills.matched.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-orange-600 mb-2">Missing Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills.missing.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tailoring Suggestions */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-600" />
                      Tailoring Score
                    </h3>
                    <span className="text-2xl font-bold text-purple-600">
                      {analysisResult.tailoring.score}%
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {analysisResult.tailoring.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <ArrowRight className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;