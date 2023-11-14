const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");

const getSearchResultsList = (questions, tags, searchInput) => {
    const searchWords = searchInput.toLowerCase().trim().split(/\s+/);

    const regularSearchWords = [];
    const tagSearchWords = [];
    searchWords.forEach(word => {
        if (word.startsWith("[") && word.endsWith("]")) {
            tagSearchWords.push(word.slice(1, -1).toLowerCase());
        } else {
            regularSearchWords.push(word);
        }
    });

    const uniqueQuestionIds = new Set();

    const regularSearchResults = questions.reduce((result, question) => {
        const questionContent = `${question.title.toLowerCase()} ${question.text.toLowerCase()}`;
        if (regularSearchWords.some(word => questionContent.includes(word))) {
            uniqueQuestionIds.add(question._id.toString());
            result.push(question);
        }
        return result;
    }, []);

    const tagSearchResults = questions.filter(question => {
        return tagSearchWords.some(tag => question.tags.includes(tag));
    });

    // Filter out questions already present in tagSearchResults
    const filteredSearchResults = regularSearchResults.filter(question => {
        return !tagSearchResults.some(tagQuestion => tagQuestion._id.toString() === question._id.toString());
    });

    return filteredSearchResults.concat(tagSearchResults);
};

exports.questions = async function (res, sortType, searchInput) {
    try {

        let questions = await Question.find().populate('tags');

        // Map the tags to their names in each question
        questions = questions.map(question => ({
            ...question.toObject(),
            tags: question.tags.map(tag => tag.name)
        }));

        if (searchInput) {
            const tags = await Tag.find();
            const searchResults = getSearchResultsList(questions, tags, searchInput);
            questions = searchResults;
        }

        if (sortType === 'newest') {
            questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
        } else if (sortType === 'active') {
            // Create a function to get the latest answer date for a question
            const getLatestAnswerDate = async (question) => {
                const answers = await Answer.find({ _id: { $in: question.answers } });
                if (answers.length === 0) {
                    return null;
                }
                return Math.max(...answers.map(answer => answer.ans_date_time));
            };

            const latestAnswerDates = await Promise.all(questions.map(getLatestAnswerDate));
            questions.sort((a, b) => {
                const aLatestAnswerDate = latestAnswerDates[questions.indexOf(a)];
                const bLatestAnswerDate = latestAnswerDates[questions.indexOf(b)];

                if (!aLatestAnswerDate && !bLatestAnswerDate) {
                    return b.ask_date_time - a.ask_date_time;
                }

                if (aLatestAnswerDate && bLatestAnswerDate) {
                    return bLatestAnswerDate - aLatestAnswerDate;
                }

                return bLatestAnswerDate ? 1 : -1;
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