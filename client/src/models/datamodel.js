import data from "./model"

class Question {
    constructor(qid, title, text, tagIds, askedBy, askDate, ansIds, views) {
        this.qid = qid;
        this.title = title;
        this.text = text;
        this.tagIds = tagIds;
        this.askedBy = askedBy;
        this.askDate = askDate;
        this.ansIds = ansIds;
        this.views = views;
    }

    getAnswers(answers) {
        return this.ansIds.map(answerId => answers.find(ans => ans.aid === answerId));
    }

    getTagNames(tags) {
        return this.tagIds.map(tagId => {
            const tag = tags.find(tag => tag.tid === tagId);
            return tag ? tag.name : '';
        });
    }

    getTagsWithNames(tags) {
        return this.tagIds.map(tagId => {
            const tag = tags.find(tag => tag.tid === tagId);
            return tag ? { id: tag.tid, name: tag.name } : null;
        }).filter(tag => tag !== null);
    }

    getTags(tags) {
        return this.tagIds.map(tagId => tags.find(tag => tag.tid === tagId));
    }

    incrementViews() {
        this.views += 1;
    }

}

class Answer {
    constructor(aid, text, ansBy, ansDate) {
        this.aid = aid;
        this.text = text;
        this.ansBy = ansBy;
        this.ansDate = ansDate;
    }
}

class Tag {
    constructor(tid, name) {
        this.tid = tid;
        this.name = name;
    }
}

class DataModel {
    constructor() {
        this.questions = [];
        this.answers = [];
        this.tags = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DataModel();
        }
        return this.instance;
    }

    loadData(data) {
        data.questions.forEach(questionData => {
            const question = new Question(
                questionData.qid,
                questionData.title,
                questionData.text,
                questionData.tagIds,
                questionData.askedBy,
                questionData.askDate,
                questionData.ansIds,
                questionData.views
            );
            this.questions.push(question);
        });

        data.answers.forEach(answerData => {
            const answer = new Answer(
                answerData.aid,
                answerData.text,
                answerData.ansBy,
                answerData.ansDate
            );
            this.answers.push(answer);
        });

        data.tags.forEach(tagData => {
            const tag = new Tag(tagData.tid, tagData.name);
            this.tags.push(tag);
        });
    }

    getAllQuestions() {
        return this.questions;
    }

    getQuestionsWithTagsAndAnswers() {
        return this.questions.map(question => {
            const tags = question.tagIds.map(tagId => this.tags.find(tag => tag.tid === tagId));
            const answers = question.ansIds.map(answerId => this.answers.find(ans => ans.aid === answerId));
            return {
                ...question,
                tags,
                answers
            };
        });
    }

    getQuestionTags(questionId) {
        const question = this.questions.find(q => q.qid === questionId);
        if (question) {
            return question.tagIds.map(tagId => this.tags.find(tag => tag.tid === tagId));
        }
        return [];
    }

    getQuestionAnswers(questionId) {
        const question = this.questions.find(q => q.qid === questionId);
        if (question) {
            return question.ansIds.map(answerId => this.answers.find(ans => ans.aid === answerId));
        }
        return [];
    }

    addQuestion(questionData) {
        const tagNames = questionData.tagNames.split(/\s+/).map(tagName => tagName.trim());

        const tagIds = tagNames.map(tagName => {
            let existingTag = this.tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
            if (!existingTag) {
                existingTag = new Tag(`t${this.tags.length + 1}`, tagName.toLowerCase());
                this.tags.push(existingTag);
            }
            return existingTag.tid;
        });

        const newQuestion = new Question(
            `q${this.questions.length + 1}`,
            questionData.title,
            questionData.text,
            tagIds,
            questionData.askedBy,
            new Date(),
            [],
            0,
        );

        this.questions.push(newQuestion);
    }

    addAnswer(questionId, answerData) {
        const answer = new Answer(
            `a${this.answers.length + 1}`,
            answerData.text,
            answerData.ansBy,
            new Date(),
        );
        this.answers.push(answer);
        const question = this.questions.find(q => q.qid === questionId);
        if (question) {
            question.ansIds.push(answer.aid);
        }
    }

    getAllTags() {
        return this.tags;
    }

    getAnswerById(answerId) {
        return this.answers.find(ans => ans.aid === answerId);
    }

    getTagNameById(tagId) {
        const tag = this.tags.find(tag => tag.tid === tagId);
        return tag ? tag.name : null;
    }

    getAllTagsWithQuestionCount() {
        const tagsWithCount = this.tags.map(tag => {
            const questionsWithTag = this.questions.filter(question => question.tagIds.includes(tag.tid));
            return {
                ...tag,
                questionCount: questionsWithTag.length,
            };
        });
        return tagsWithCount;
    }
}

const dataModel = DataModel.getInstance();
dataModel.loadData(data);

export default dataModel;