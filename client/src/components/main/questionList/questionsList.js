import React, {useEffect, useState} from 'react';
import dataModel from '../../../models/datamodel';
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
    const [tagNames, setTagNames] = useState({});

    function updateSortedQuestions() {
        const apiUrl = `http://localhost:8000/questions`;
        axios.get(apiUrl)
            .then(response => {
                //const questions = response.data;
                //const sortedQuestionsArray = [...questions].sort((a, b) => b.askDate - a.askDate);
                setSortedQuestions(response.data);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

    function fetchTagNames() {
        const tagNamesPromises = [];
        for (const question of sortedQuestions) {
            for (const tag of question.tags) {
                if (!tagNames[tag]) {
                    const apiUrl = `http://localhost:8000/tags/tag-id/${tag}`;
                    const tagPromise = axios.get(apiUrl)
                        .then(response => {
                            return { tag, name: response.data };
                        })
                        .catch(error => {
                            console.error('Error fetching tag name:', error);
                            return { tag, name: null };
                        });
                    tagNamesPromises.push(tagPromise);
                }
            }
        }
        Promise.all(tagNamesPromises)
            .then(results => {
                const tagNamesMap = {};
                results.forEach(result => {
                    tagNamesMap[result.tag] = result.name;
                });

                setTagNames(tagNamesMap);
            });
    }

    useEffect(() => {
        updateSortedQuestions();
    }, []);

    useEffect(() => {
        fetchTagNames();
    }, [sortedQuestions]); // Fetch tag names whenever sortedQuestions changes

    const handleAskQuestion = () => {
        setShowForm(true);
    };

    const handleFormSubmit = (formData) => {
        const apiUrl = `http://localhost:8000/questions`;
        axios.post(apiUrl, formData)
            .then(response => {
                console.log('Question added successfully:', response.data);
            })
            .catch(error => {
                console.error('Error adding question:', error);
            });
        fetchTagNames();
        updateSortedQuestions();
        setShowForm(false);
    };

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    const handleSort = (sortType) => {
        let sortedQuestionsArray = [...dataModel.getAllQuestions()];

        if (sortType === 'newest') {
            sortedQuestionsArray.sort((a, b) => b.ask_date_time - a.ask_date_time); // ask_date_time not askDate //Pending
        } else if (sortType === 'active') {
            sortedQuestionsArray.sort((a, b) => {
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
            sortedQuestionsArray = sortedQuestionsArray.filter(
                (question) => dataModel.getQuestionAnswers(question.qid).length === 0
            );
        }
        setSortedQuestions(sortedQuestionsArray);
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
                                        <p>{dataModel.getQuestionAnswers(question.qid).length} answers</p>
                                    </div>
                                    <div className={"question-mid"}>
                                        <h4 className={"postTitle"}
                                            onClick={() => handleQuestionClick(question)}
                                        >{question.title}
                                        </h4>
                                        <p style={{"fontSize":"12px"}} dangerouslySetInnerHTML={formatQuestionText(question.text)} />
                                        <div className="tags">
                                            {question.tags.map(tag => (
                                                <span key={tag} className="badge">{tagNames[tag]}</span>
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