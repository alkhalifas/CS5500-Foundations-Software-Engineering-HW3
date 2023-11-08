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
        res.status(500).json({ error: 'Internal Server Error' });
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
        res.status(500).json({ error: 'Internal Server Error' });
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
        res.status(500).json({ error: 'Internal Server Error' });
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
        res.status(500).json({ error: 'Internal Server Error' });
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

