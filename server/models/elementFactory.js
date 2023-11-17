const Answer = require("../models/answers");
const Question = require("../models/questions");
const Tag = require("../models/tags");

const element = { Question, Answer, Tag };

exports.create_element = function(type, parameters) {
    const ElementType = element[type];

    return new ElementType(parameters);
}