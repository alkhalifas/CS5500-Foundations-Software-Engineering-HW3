// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

// Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import schemas
const Tag = require('./models/tags');
const Answer = require('./models/answers');
const Question = require('./models/questions');

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

// Provision App
const app = express();
const PORT = 8000;

// Configure Database
const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Configure CORS/Express
app.use(cors());
app.use(express.json());

/*
Method that returns everything
 */
app.get('/questions/all', async (req, res) => {
    try {
        const questions = await Question.find().populate('tags answers');
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting all questions, tags, and answers' });
    }
});

/*
Method that returns all questions and associated fields
 */
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting all questions' });
    }
});

/*
Method that returns all tags and their IDs
 */
app.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting tags' });
    }
});

/*
Method that returns the answers to a given question
 */
app.get('/questions/:questionId/answers', async (req, res) => {
    const { questionId } = req.params;
    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        const answers = await Answer.find({ _id: { $in: question.answers } });
        res.json(answers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting answers to question' });
    }
});

/*
Method that returns homepage message
 */
app.get('/', async (req, res) => {
    try {
        res.json({"message":"Welcome to FSO!"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/*
Method that posts a new question
 */
app.post('/questions', async (req, res) => {
    const { title, text, tags } = req.body;

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
});

/*
Method that gets questions for a given tag
 */
// Define a route to get all questions related to a specific tag
app.get('/questions/tag/:tagName', async (req, res) => {
    const { tagName } = req.params;

    try {
        const tag = await Tag.findOne({ name: tagName.toLowerCase() });

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        const questions = await Question.find({ tags: tag._id }).populate('tags answers');

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting questions for tag' });
    }
});

/*
Method that increments views by 1
 */
app.post('/questions/increment-views/:questionId', async (req, res) => {
    const { questionId } = req.params;

    try {
        // Find the question by Id
        // const question = await Question.findById(questionId);
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Increment view by 1
        question.views += 1;

        // Save it
        await question.save();

        res.json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error incrementing views' });
    }
});

// Display message when disconnected
process.on('SIGINT', () => {
    mongoose.connection.close()
        .then(() => {
            console.log('Server closed. Database instance disconnected');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error closing database connection:', err);
            process.exit(1);
        });
});

// Display message when starting
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
