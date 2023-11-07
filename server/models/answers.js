// Answer Document Schema
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: String,
        default: 'Anonymous'
    },
    ans_date_time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Answer', answerSchema);
