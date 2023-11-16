import React, {useEffect, useState} from 'react';
import dataModel from '../../../models/datamodel';
import QuestionCardTiming from "../questionList/QuestionCardTiming";
import formatQuestionText from "../utils";
import AnswersPage from "../Answers/AnswersPage";
import axios from "axios";

export default function TagQuestionsList({ tag }) {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const apiUrl = `http://localhost:8000/questions/tag-id/${tag._id}`;

        axios.get(apiUrl)
            .then(response => {
                setQuestions(response.data);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }, []);

    console.log("questions: ", questions)

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    return (
        <>
            <div className="header-container">
                <h3>{questions.length} questions</h3>
                <h3 className={"blue-filter"}>Filter: {`"${tag.name}"`}</h3>
            </div>

            {selectedQuestion ? (
                <div id={"answersHeader"}>
                    <div className="header-container">
                        <h1></h1>
                    </div>
                    <AnswersPage question={selectedQuestion} />

                </div>
            ) : (
                <div className="question-cards">
                    {questions.map((question, index) => (
                        <div key={question._id}>
                            <div
                                key={question._id}
                                className="question-card"
                                // onClick={() => handleQuestionClick(question)}
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
                                    {/*<p>Tags: {question.tags}</p>*/}
                                    {/*<p>Tags: {question.getTagNames(dataModel.tags).join(', ')}</p>*/}
                                    <div className="tags">
                                        {question.tags.map(tag => (
                                            <span key={tag.id} className="badge">{tag.name}</span>
                                        ))}
                                    </div>

                                </div>
                                <div className={"question-right lastActivity"}>
                                    <QuestionCardTiming question={question} />
                                </div>
                            </div>
                            {index !== questions.length - 1 && <div className="dotted-line" />}
                        </div>
                    ))}
                </div>
            )}


        </>
    );
}
