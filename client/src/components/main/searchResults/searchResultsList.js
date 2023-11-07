import React, { useEffect, useState } from 'react';
import dataModel from '../../../models/datamodel';
import QuestionCardTiming from "../questionList/QuestionCardTiming";
import formatQuestionText from "../utils"
import QuestionForm from "../questionForm/questionForm";
import AnswersPage from "../Answers/AnswersPage";

export default function SearchResultsList({ searchInput }) {
    const [showForm, setShowForm] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [originalSearchResults, setOriginalSearchResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const results = getSearchResultsList(searchInput);
        const sortedResults = [...results].sort((a, b) => b.askDate - a.askDate);
        setOriginalSearchResults(sortedResults);
        setSearchResults(sortedResults);
    }, [searchInput]);

    const handleAskQuestion = () => {
        setShowForm(true);
    };

    const handleFormSubmit = (formData) => {
        dataModel.addQuestion(formData);
        setShowForm(false);
    };

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    const handleSort = (sortType) => {
        let sortedResultsArray = [...originalSearchResults];

        if (sortType === 'newest') {
            sortedResultsArray.sort((a, b) => b.askDate - a.askDate);
        } else if (sortType === 'active') {
            sortedResultsArray.sort((a, b) => {
                const aAnswers = dataModel.getQuestionAnswers(a.qid);
                const bAnswers = dataModel.getQuestionAnswers(b.qid);

                if (aAnswers.length === 0 && bAnswers.length === 0) {
                    return b.askDate - a.askDate;
                }

                if (aAnswers.length === bAnswers.length) {
                    const aLatestAnswerDate = aAnswers.reduce((latestDate, answer) =>
                        Math.max(latestDate, answer.ansDate), a.askDate);
                    const bLatestAnswerDate = bAnswers.reduce((latestDate, answer) =>
                        Math.max(latestDate, answer.ansDate), b.askDate);
                    return bLatestAnswerDate - aLatestAnswerDate;
                }

                return bAnswers.length - aAnswers.length;
            });
        } else if (sortType === 'unanswered') {
            sortedResultsArray = sortedResultsArray.filter(
                (question) => dataModel.getQuestionAnswers(question.qid).length === 0
            );
        }

        setSearchResults(sortedResultsArray);
    };

    const getSearchResultsList = (searchInput) => {
        const questions = dataModel.getAllQuestions();
        const tags = dataModel.getAllTags();
        const searchWords = searchInput.toLowerCase().trim().split(/\s+/);

        const regularSearchWords = [];
        const tagSearchWords = [];
        searchWords.forEach(word => {
            if (word.startsWith("[") && word.endsWith("]")) {
                tagSearchWords.push(word.slice(1, -1).toLowerCase());
            } else {
                regularSearchWords.push(word);
            }
        });

        const regularSearchResults = questions.filter(question => {
            const questionContent = `${question.title.toLowerCase()} ${question.text.toLowerCase()}`;
            return regularSearchWords.some(word => questionContent.includes(word));
        });

        const tagSearchResults = questions.filter(question => {
            const questionTags = question.tagIds.map(tagId => tags.find(tag => tag.tid === tagId).name.toLowerCase());
            return tagSearchWords.some(tag => questionTags.includes(tag));
        });

        return regularSearchResults.concat(tagSearchResults);
    };

    return (
        <div>
            {showForm ? (
                <QuestionForm onSubmit={handleFormSubmit} />
            ) : selectedQuestion ? (
                <div id={"answersHeader"}>
                    <div className="header-container">
                        <h1></h1>
                        <button className={"ask-question-button"} onClick={handleAskQuestion}>Ask a Question</button>
                    </div>
                    <AnswersPage question={selectedQuestion} />

                </div>
            ) : (
                <>
                    <div className="header-container">
                        <h1>Search Results</h1>
                        <button className={"ask-question-button"} onClick={handleAskQuestion}>Ask a Question</button>
                    </div>
                    <div className="header-container">
                        <h3>{searchResults.length} results</h3>
                        <div className="sorting-buttons">
                            <button className={"sort-button"} onClick={() => handleSort('newest')}>Newest</button>
                            <button className={"sort-button"} onClick={() => handleSort('active')}>Active</button>
                            <button className={"sort-button"} onClick={() => handleSort('unanswered')}>Unanswered</button>
                        </div>
                    </div>
                    {searchResults.length === 0 ? (
                        <div className="no-questions-found-message">
                            <h3>No Questions Found</h3>
                        </div>
                    ) : (
                        <div className="question-cards scrollable-container">
                            {searchResults.map((question, index) => (
                                <div key={question.qid}>
                                    <div key={question.qid} className="question-card">
                                        <div className={"question-left postStats"}>
                                            <p>{question.views} views</p>
                                            <p>{dataModel.getQuestionAnswers(question.qid).length} answers</p>
                                        </div>
                                        <div className={"question-mid"}>
                                            <h4 className={"postTitle"} onClick={() => handleQuestionClick(question)}>{question.title}</h4>
                                            <p style={{"fontSize":"12px"}} dangerouslySetInnerHTML={formatQuestionText(question.text)} />
                                            <div className="tags">
                                                {question.getTagsWithNames(dataModel.tags).map(tag => (
                                                    <span key={tag.id} className="badge">{tag.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={"question-right lastActivity"}>
                                            <QuestionCardTiming question={question} />
                                        </div>
                                    </div>
                                    {index !== searchResults.length - 1 && <div className="dotted-line" />}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}