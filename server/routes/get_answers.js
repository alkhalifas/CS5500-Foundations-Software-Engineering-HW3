const Question = require("../models/questions");
const Answer = require("../models/answers");

exports.answers = async function (res, questionId) {
    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        const answers = await Answer.find({ _id: { $in: question.answers } });
        answers.sort((a, b) => b.ans_date_time - a.ans_date_time);
        res.json(answers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting answers to question' });
    }
}