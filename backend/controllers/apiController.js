const User = require('../models/User');
// const OpenAI = require('openai');

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

exports.analyzeResume = async (req, res) => {
    const { resumeText, jobDescription } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (user.credits <= 0) {
            return res.status(402).json({ message: 'Insufficient credits' });
        }

        // Placeholder for OpenAI API call
        console.log('Analyzing resume for user:', userId);
        console.log('Resume Text:', resumeText);
        console.log('Job Description:', jobDescription);

        // Deduct one credit
        user.credits -= 1;
        await user.save();

        // Mock response
        const analysis = {
            feedback: {
                grammar: "Excellent grammar.",
                structure: "Well-structured and easy to read.",
                skills: "Strong set of skills, but could highlight more soft skills.",
                suggestions: "Consider adding a project section to showcase your work."
            },
            matchScore: jobDescription ? 85 : null,
            missingKeywords: jobDescription ? ["Agile", "JIRA", "CI/CD"] : [],
            tailoringTips: jobDescription ? "Add the missing keywords to better align with the job description." : null
        };

        res.json({ analysis, creditsRemaining: user.credits });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.generateInterview = async (req, res) => {
    const { jobRole, jobDescription } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (user.credits <= 0) {
            return res.status(402).json({ message: 'Insufficient credits' });
        }

        // Placeholder for OpenAI API call
        console.log('Generating interview questions for user:', userId);
        console.log('Job Role:', jobRole);
        console.log('Job Description:', jobDescription);
        
        // Deduct one credit
        user.credits -= 1;
        await user.save();

        // Mock response
        const interview = [
            { question: "Tell me about yourself.", answer: "I am a passionate software developer with 5 years of experience in..." },
            { question: "What are your strengths?", answer: "My main strengths are problem-solving and my ability to learn quickly." },
            { question: "Why do you want to work for our company?", answer: "I am impressed with your company's innovation in the tech space and I believe my skills are a great fit." },
            { question: "Describe a challenging situation you faced at work.", answer: "Once, we had a critical bug just before a release. I took the lead to..." },
            { question: "Where do you see yourself in 5 years?", answer: "I see myself growing into a senior role, mentoring junior developers..." }
        ];

        res.json({ interview, creditsRemaining: user.credits });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.useCredit = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (user.credits <= 0) {
            return res.status(402).json({ message: 'No credits to use' });
        }
        user.credits -= 1;
        await user.save();
        res.json({ message: 'Credit used successfully', creditsRemaining: user.credits });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}; 