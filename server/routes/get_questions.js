const Question = require("../models/questions");
const Answer = require("../models/answers");

exports.questions = async function (res, sortType) {
    try {

        let questions = await Question.find();
        let answers = await Answer.find();

        if (sortType === 'newest') {
            questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
        } else if (sortType === 'active') {
            questions.sort(async(a, b) => {
                const aAnswers = await Answer.find({ _id: { $in: a.answers } });
                const bAnswers = await Answer.find({ _id: { $in: b.answers } });

                if (aAnswers.length === 0 && bAnswers.length === 0) {
                    return b.ask_date_time - a.ask_date_time;
                }

                if (aAnswers.length === bAnswers.length) {
                    const aLatestAnswerDate = aAnswers.reduce((latestDate, answer) =>
                        Math.max(latestDate, answer.ans_date_time), a.ask_date_time);
                    const bLatestAnswerDate = bAnswers.reduce((latestDate, answer) =>
                        Math.max(latestDate, answer.ans_date_time), b.ask_date_time);
                    return bLatestAnswerDate - aLatestAnswerDate;
                }

                return bAnswers.length - aAnswers.length;
            });
        } else if (sortType === 'unanswered') {
            questions = questions.filter(
                (question) => question.answers.length === 0
            ).sort((a, b) => b.ask_date_time - a.ask_date_time);
        }

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting list of questions' });
    }
}