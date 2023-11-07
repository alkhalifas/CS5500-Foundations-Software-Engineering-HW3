// Tag Document Schema
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Tag', tagSchema);
