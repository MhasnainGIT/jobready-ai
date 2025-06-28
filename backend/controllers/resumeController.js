const openai = require('../utils/openaiClient');

exports.analyzeResume = async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  // Validate input
  if (!resumeText || !resumeText.trim()) {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured');
    return res.status(500).json({ 
      error: 'OpenAI API key is not configured. Please contact the administrator.' 
    });
  }

  let prompt = `You are a professional resume reviewer. Analyze the following resume and provide feedback on grammar, formatting, and skills. Return your response as a JSON object with keys: feedback, improvementTips`;
  if (jobDescription) {
    prompt += `, matchScore (0-100), missingKeywords (array), and tailoringTips. Compare the resume to the job description and give extra tips for improvement.\nResume:\n${resumeText}\nJob Description:\n${jobDescription}`;
  } else {
    prompt += `.\nResume:\n${resumeText}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional resume reviewer.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    });

    // Try to parse the response as JSON
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      // If parsing fails, return the raw text
      return res.status(200).json({ raw: completion.choices[0].message.content });
    }

    res.json(result);
  } catch (err) {
    console.error('OpenAI error:', err.message);
    
    // Provide more specific error messages
    if (err.message.includes('401')) {
      return res.status(500).json({ 
        error: 'OpenAI API key is invalid. Please contact the administrator.' 
      });
    } else if (err.message.includes('429')) {
      return res.status(500).json({ 
        error: 'OpenAI API rate limit exceeded. Please try again later.' 
      });
    } else if (err.message.includes('network')) {
      return res.status(500).json({ 
        error: 'Network error connecting to OpenAI. Please try again.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
    });
  }
};

exports.generateInterview = async (req, res) => {
  const { jobRole } = req.body;
  if (!jobRole) {
    return res.status(400).json({ error: 'jobRole is required' });
  }

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured');
    return res.status(500).json({ 
      error: 'OpenAI API key is not configured. Please contact the administrator.' 
    });
  }

  const prompt = `Generate 5 realistic interview questions for the role of ${jobRole}. For each, provide a sample answer. Return as a JSON array of objects with keys: question and answer.`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert interview coach.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      return res.status(200).json({ raw: completion.choices[0].message.content });
    }
    res.json({ questions: result });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    
    // Provide more specific error messages
    if (err.message.includes('401')) {
      return res.status(500).json({ 
        error: 'OpenAI API key is invalid. Please contact the administrator.' 
      });
    } else if (err.message.includes('429')) {
      return res.status(500).json({ 
        error: 'OpenAI API rate limit exceeded. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate interview questions',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
    });
  }
}; 