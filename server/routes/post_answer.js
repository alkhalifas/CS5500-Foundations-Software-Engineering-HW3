const Answer = require("../models/answers");
const Question = require("../models/questions");
const elementFactory = require("../models/elementFactory");

async function answerCreate(text, ans_by, ans_date_time) {
    try {
        const ans = elementFactory.create_element('Answer', {
            text: text,
            ans_by: ans_by,
            ans_date_time: ans_date_time,
        });

        await ans.save();
        return ans;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.post_answer = async function (res, questionId, text, ans_by) {
    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        const newAnswer = await answerCreate(text, ans_by, new Date());

        question.answers.push(newAnswer._id);
        await question.save();

        res.status(201).json(newAnswer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding new answer' });
    }
}