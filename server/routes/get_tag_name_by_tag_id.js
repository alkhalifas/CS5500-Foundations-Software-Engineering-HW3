const Tag = require("../models/tags");
const Question = require("../models/questions");
exports.get_tag_name_by_tag_id = async function (res, tagId) {
    try {
        const tag = await Tag.findById(tagId);

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.json(tag.name);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting questions for tag' });
    }
}