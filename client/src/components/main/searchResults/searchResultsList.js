import React, { useEffect, useState, useCallback } from 'react';
import QuestionCardTiming from "../questionList/QuestionCardTiming";
import formatQuestionText from "../utils"
import QuestionForm from "../questionForm/questionForm";
import AnswersPage from "../Answers/AnswersPage";
import axios from "axios";

export default function SearchResultsList({ searchInput }) {
    const [showForm, setShowForm] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const handleAskQuestion = () => {
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        const apiUrl = `http://localhost:8000/questions`;
        try {
            const response = await axios.post(apiUrl, formData);
            console.log('Question added successfully:', response.data);
            setShowForm(false);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    const handleSort = useCallback((sortType) => {
        const apiUrl = `http://localhost:8000/questions?sort=${sortType}&searchInput=${searchInput}`;
        axios.get(apiUrl)
            .then(response => {
                setSearchResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }, [searchInput]);

    useEffect(() => {
        handleSort('newest');
    }, [searchInput, handleSort]);

    return (
        <div>
            {showForm ? (
                <QuestionForm onSubmit={handleFormSubmit} />
            ) : selectedQuestion ? (
                <div id={"answersHeader"}>
                    <div className="header-container">
                        <h1>Search Results</h1>
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
                                            <p>{question.answers.length} answers</p>
                                        </div>
                                        <div className={"question-mid"}>
                                            <h4 className={"postTitle"} onClick={() => handleQuestionClick(question)}>{question.title}</h4>
                                            <p style={{"fontSize":"12px"}} dangerouslySetInnerHTML={formatQuestionText(question.text)} />
                                            <div className="tags">
                                                {question.tags.map(tag => (
                                                    <span key={tag} className="badge">{tag}</span>
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