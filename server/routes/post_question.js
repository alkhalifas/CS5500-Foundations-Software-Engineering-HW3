const Tag = require("../models/tags");
exports.post_question = async function (res) {
    // Normalize tags to lowercase for case-insensitivity to avoid react being the same as REACT
    const normalizedTags = tags.map(tag => tag.toLowerCase());

    try {
        const tagIds = [];

        // Check if each tag exists or create it if it doesn't
        for (const tagText of normalizedTags) {
            // Chek if exists
            let existingTag = await Tag.findOne({ name: tagText });
            // If does not exist
            if (!existingTag) {
                // Create a new tag if it doesn't exist
                existingTag = await tagCreate(tagText);
            }
            // Add tag
            tagIds.push(existingTag._id);
        }

        // Create the question with the tag IDs
        const newQuestion = await questionCreate(title, text, tagIds, [], 'Anonymous', new Date(), 0);

        res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding new question' });
    }

}