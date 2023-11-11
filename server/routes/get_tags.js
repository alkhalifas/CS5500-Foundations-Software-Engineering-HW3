const Tag = require("../models/tags");
exports.tags = async function (res) {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting tags' });
    }

}