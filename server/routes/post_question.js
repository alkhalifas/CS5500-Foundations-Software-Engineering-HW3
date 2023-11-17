const Tag = require("../models/tags");
const Question = require("../models/questions");
const elementFactory = require("../models/elementFactory");

async function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
    try {
        const qstn = elementFactory.create_element('Question', {
            title: title,
            text: text,
            tags: tags,
            asked_by: asked_by,
            answers: answers,
            ask_date_time: ask_date_time,
            views: views,
        });

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
            tag = elementFactory.create_element('Tag', { name: name.toLowerCase() });
            await tag.save();
        }

        return tag;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.post_question = async function (res, title, text, tags, asked_by) {
    const tagNames = tags.split(/\s+/).map(tagName => tagName.trim());
    
    // Normalize tags to lowercase for case-insensitivity to avoid react being the same as REACT
    const normalizedTags = tagNames.map(tag => tag.toLowerCase());

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
        const newQuestion = await questionCreate(title, text, tagIds, [], asked_by, new Date(), 0);

        res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding new question' });
    }
}