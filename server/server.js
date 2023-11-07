// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Question = require('./models/questions');


const app = express();
const PORT = 8000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/fake_so';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', async (req, res) => {
    try {
        res.json({"message":"Welcome!"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find().populate('tags answers');
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


process.on('SIGINT', () => {
    db.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});