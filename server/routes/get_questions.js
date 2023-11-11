const Question = require("../models/questions");
exports.questions = async function (res) {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting list of questions' });
    }
}