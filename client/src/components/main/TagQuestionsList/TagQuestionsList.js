import React, {useState} from 'react';
import dataModel from '../../../models/datamodel';
import QuestionCardTiming from "../questionList/QuestionCardTiming";
import formatQuestionText from "../utils";
import AnswersPage from "../Answers/AnswersPage";

export default function TagQuestionsList({ tagId }) {
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const questionsWithCurrentTag = dataModel.getAllQuestions().filter(question =>
        question.tagIds.includes(tagId)
    );

    const tagName = dataModel.getTagNameById(tagId);

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    return (
        <>
            <div className="header-container">
                <h3>{questionsWithCurrentTag.length} questions</h3>
                <h3 className={"blue-filter"}>Filter: {`"${tagName}"`}</h3>
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
                    {questionsWithCurrentTag.map((question, index) => (
                        <div key={question.qid}>
                            <div
                                key={question.qid}
                                className="question-card"
                                // onClick={() => handleQuestionClick(question)}
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
                                    {/*<p>Tags: {question.tags}</p>*/}
                                    {/*<p>Tags: {question.getTagNames(dataModel.tags).join(', ')}</p>*/}
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
                            {index !== questionsWithCurrentTag.length - 1 && <div className="dotted-line" />}
                        </div>
                    ))}
                </div>
            )}


        </>
    );
}
