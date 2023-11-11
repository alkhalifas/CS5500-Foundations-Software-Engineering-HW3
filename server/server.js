// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

// Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
let bodyParser = require('body-parser');

// Import schemas
const Tag = require('./models/tags');
const Answer = require('./models/answers');
const Question = require('./models/questions');

// Import Route Methods
const home_function = require('./routes/get_home')
const all_questions_function = require('./routes/all_questions')
const questions_function = require('./routes/get_questions')
const tags_function = require('./routes/get_tags')
const answers_function = require('./routes/get_answers')
const post_question_function = require('./routes/post_question')
const get_questions_by_tag_name_function = require("./routes/get_questions_by_tag_name");
const get_questions_by_tag_id_function = require("./routes/get_questions_by_tag_id");
const get_tags_with_count_function = require("./routes/get_tags_with_count");

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
db.on('connected', function() {
    console.log('Connected to database');
});

// Configure CORS/Express
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

/*
Method that returns homepage message
 */
app.get('/', async (req, res) => {
    await home_function.home(res);
});

/*
Method that returns everything
 */
app.get('/questions/all', async (req, res) => {
    await all_questions_function.allQuestions(res)
});

/*
Method that returns all questions and associated fields
 */
app.get('/questions', async (req, res) => {
    await questions_function.questions(res)
});

/*
Method that returns all tags and their IDs
 */
app.get('/tags', async (req, res) => {
    await tags_function.tags(res)
});

/*
Method that returns the answers to a given question
 */
app.get('/questions/:questionId/answers', async (req, res) => {
    const { questionId } = req.params;
    await answers_function.answers(res, questionId)
});

/*
Method that posts a new question
 */
app.post('/questions', async (req, res) => {
    const { title, text, tags } = req.body;
    await post_question_function.post_question(res, title, text, tags)
});

/*
Method that gets questions for a given tag
 */
app.get('/questions/tag/:tagName', async (req, res) => {
    const { tagName } = req.params;
    await get_questions_by_tag_name_function.get_questions_by_tag_name(res, tagName)
});

/*
Method that returns questions for a given tan id
 */
app.get('/questions/tag-id/:tagId', async (req, res) => {
    const { tagId } = req.params;
    await get_questions_by_tag_id_function.get_questions_by_tag_id(res, tagId);
});


/*
Method that gets tag with teg count
 */
app.get('/tags-with-count', async (req, res) => {
    await get_tags_with_count_function.get_tags_with_count(res);
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
