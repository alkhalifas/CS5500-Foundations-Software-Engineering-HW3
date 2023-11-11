const Tag = require("../models/tags");
const Question = require("../models/questions");

async function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
    try {
        const tempQuestion = {
            title: title,
            text: text,
            tags: tags,
            asked_by: asked_by,
            answers: answers,
            ask_date_time: ask_date_time,
            views: views,
        };

        const qstn = new Question(tempQuestion);
        await qstn.save();
        return qstn;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function tagCreate(name) {
    try {
        let tag = await Tag.findOne({ name: name.toLowerCase() });

        if (!tag) {
            // Create a new tag if it doesn't exist
            tag = new Tag({ name: name.toLowerCase() });
            await tag.save();
        }

        return tag;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

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