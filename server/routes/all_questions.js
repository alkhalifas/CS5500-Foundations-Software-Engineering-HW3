const Question = require("../models/questions");
exports.allQuestions = async function (res) {
    try {
        const questions = await Question.find().populate('tags answers');
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting all questions, tags, and ther answers' });
    }
}