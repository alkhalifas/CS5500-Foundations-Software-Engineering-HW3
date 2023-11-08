import React, { useEffect, useState } from 'react';
import "./AnswersPage.css"
import QuestionCardTiming from "../questionList/QuestionCardTiming.js"
import dataModel from "../../../models/datamodel";
import AnswerCardTiming from "./AnswerCardTiming";
import AnswerForm from "../answerForm/answerForm";
import formatQuestionText from "../utils";

export default function AnswersPage({ question}) {
    const [answers, setAnswers] = useState([]);
    const [views, setViews] = useState([]);
    const [showAnswerForm, setShowAnswerForm] = useState(false);

    function updateSortedAnswers() {
        const answers = dataModel.getQuestionAnswers(question.qid);
        const sortedAnswersArray = [...answers].sort((a, b) => b.ansDate - a.ansDate);
        setAnswers(sortedAnswersArray);
    }

    useEffect(() => {
        // Increment views when the component is mounted
        question.incrementViews(question.qid);
        setViews(question.views);

        // Get answers using DataModel's getQuestionAnswers method
        updateSortedAnswers();
    }, [question.qid]);

    const handleAnswerQuestion = () => {
        setShowAnswerForm(true);
    };

    const handleFormSubmit = (formData) => {
        dataModel.addAnswer(question.qid, formData);
        updateSortedAnswers();
        setShowAnswerForm(false);
    };

    return (
        <div>
            {!showAnswerForm ? (
                <>
                    <div className="header-container">
                        <h3>{question.ansIds.length} answers</h3>
                        <h3>{question.title}</h3>
                        <h3> </h3>
                    </div>
                    <div className="question-container" id={"questionBody"}>
                        <div className="views-column">
                            <span className="views-count">{views} views</span>
                        </div>
                        <div className="question-text-column">
                            <p style={{"fontSize":"12px"}} dangerouslySetInnerHTML={formatQuestionText(question.text)} />
                        </div>
                        <div className="asked-by-column">
                            <span className="asked-data"><QuestionCardTiming question={question} /></span>
                        </div>
                    </div>
                    <div className="dotted-line" />
                    <div className="answerText">
                        {answers.map((answer, index) => (
                            <div key={answer.aid}>
                                <div key={answer.aid} className="answer-card" id={"questionBody"}>
                                    <div className="question-text-column">
                                        <span className="question-text">
                                            <p style={{"fontSize":"12px"}} dangerouslySetInnerHTML={formatQuestionText(answer.text)} />
                                        </span>
                                    </div>
                                    <div className="asked-by-column answerAuthor">
                                        <span className="asked-data"><AnswerCardTiming answer={answer} /></span>
                                    </div>
                                </div>
                                {index !== answers.length - 1 && <div className="dotted-line" />}
                            </div>
                        ))}
                    </div>
                    <div className="button-container">
                        <button type="submit" onClick={handleAnswerQuestion} className="answer-question" >Answer Question</button>
                    </div>
                </>
            ) : (
                <AnswerForm onSubmit={handleFormSubmit} />
            )}
        </div>
    );
}