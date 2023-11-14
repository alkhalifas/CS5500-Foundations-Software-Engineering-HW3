import React, {useEffect, useState} from 'react';
import QuestionForm from "../questionForm/questionForm";
import "./questionList.css"
import AnswersPage from "../Answers/AnswersPage";
import QuestionCardTiming from "./QuestionCardTiming";
import formatQuestionText from "../utils"
import axios from "axios";

export default function QuestionsList() {
    const [showForm, setShowForm] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [sortedQuestions, setSortedQuestions] = useState([]);

    useEffect(() => {
        handleSort('newest');
    }, []);

    const handleAskQuestion = () => {
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        const apiUrl = `http://localhost:8000/questions`;
        try {
            const response = await axios.post(apiUrl, formData);
            console.log('Question added successfully:', response.data);

            await handleSort('newest');

            setShowForm(false);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    const handleSort = async (sortType) => {
        const apiUrl = `http://localhost:8000/questions?sort=${sortType}`;
        try {
            const response = await axios.get(apiUrl);
            setSortedQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    return (
        <div>
            {showForm ? (
                <QuestionForm onSubmit={handleFormSubmit} />
            ) : selectedQuestion ? (
                <div id={"answersHeader"}>
                    <div className="header-container">
                        <h1>All Answers</h1>
                        <button className={"ask-question-button"} onClick={handleAskQuestion}>Ask a Question</button>
                    </div>
                    <AnswersPage question={selectedQuestion} />

                </div>
            ) : (
                <>
                    <div className="header-container">
                        <h1>All Questions</h1>
                        <button className={"ask-question-button"} onClick={handleAskQuestion}>Ask a Question</button>
                    </div>

                    <div className="header-container">
                        <h3>{sortedQuestions.length} questions</h3>
                        <div className="sorting-buttons">
                            <button className={"sort-button"} onClick={() => handleSort('newest')}>Newest</button>
                            <button className={"sort-button"} onClick={() => handleSort('active')}>Active</button>
                            <button className={"sort-button"} onClick={() => handleSort('unanswered')}>Unanswered</button>
                        </div>
                    </div>

                    <div className="question-cards scrollable-container">
                        {sortedQuestions.map((question, index) => (
                            <div key={question.qid}>
                                <div
                                    key={question.qid}
                                    className="question-card"
                                >
                                    <div className={"question-left postStats"}>
                                        <p>{question.views} views</p>
                                        <p>{question.answers.length} answers</p>
                                    </div>
                                    <div className={"question-mid"}>
                                        <h4 className={"postTitle"}
                                            onClick={() => handleQuestionClick(question)}
                                        >{question.title}
                                        </h4>
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
                                {index !== sortedQuestions.length - 1 && <div className="dotted-line" />}
                            </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}