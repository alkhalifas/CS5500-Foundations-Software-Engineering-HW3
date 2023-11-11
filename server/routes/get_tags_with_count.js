const Question = require("../models/questions");
const Tag = require("../models/tags");
exports.get_tags_with_count = async function (res) {
    try {
        const tagCounts = await Question.aggregate([
            {
                $unwind: '$tags',
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 },
                },
            },
        ]);

        const tagsWithCount = await Promise.all(
            tagCounts.map(async (tagCount) => {
                const tag = await Tag.findById(tagCount._id);
                return {
                    _id: tagCount._id,
                    name: tag ? tag.name : 'Unknown',
                    count: tagCount.count,
                };
            })
        );

        res.json(tagsWithCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting tags with counts' });
    }

}