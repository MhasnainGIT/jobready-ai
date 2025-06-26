const openai = require('../utils/openaiClient');

exports.analyzeResume = async (req, res) => {
  const { resumeText, jobDescription } = req.body;

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
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};

exports.generateInterview = async (req, res) => {
  const { jobRole } = req.body;
  if (!jobRole) {
    return res.status(400).json({ error: 'jobRole is required' });
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
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
}; 