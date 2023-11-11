const Question = require("../models/questions");
exports.post_increment_question_view = async function (res, questionId) {
    try {
        // Find the question by Id
        // const question = await Question.findById(questionId);
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Increment view by 1
        question.views += 1;

        // Save it
        await question.save();

        res.json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error incrementing views' });
    }

}