const Tag = require("../models/tags");
const Question = require("../models/questions");
exports.get_questions_by_tag_id = async function (res, tagId) {
    try {
        const tag = await Tag.findById(tagId);

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        const questions = await Question.find({ tags: tag._id }).populate('tags answers');

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting questions for tag' });
    }

}