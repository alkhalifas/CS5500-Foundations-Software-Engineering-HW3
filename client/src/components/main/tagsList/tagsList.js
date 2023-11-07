import React, { useState } from 'react';
import dataModel from '../../../models/datamodel';
import "./tagsList.css"
import QuestionForm from "../questionForm/questionForm";
import TagQuestionsList from "../TagQuestionsList/TagQuestionsList"; // Import the TagQuestionsList component

export default function TagsList() {
    const [showForm, setShowForm] = useState(false);
    const [selectedTag, setSelectedTag] = useState(false);
    const tagsWithQuestionCount = dataModel.getAllTagsWithQuestionCount();

    const handleAskQuestion = () => {
        setShowForm(true);
    };

    const handleTagClick = (tagId) => {
        setSelectedTag(tagId);
    };

    const handleFormSubmit = (formData) => {
        dataModel.addQuestion(formData);
        setShowForm(false);
    };

    return (
        <div>
            {showForm ? (
                <QuestionForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
            ) : (
                selectedTag ? (
                        <TagQuestionsList tagId={selectedTag} />
                    ) : (
                        <div>
                            <div className="header-container">
                                <h3>{tagsWithQuestionCount.length} Tags</h3>
                                <h1>All Tags</h1>
                                <button className={"ask-question-button"} onClick={handleAskQuestion}>Ask a Question</button>
                            </div>

                            <div className="tags-container">
                                {tagsWithQuestionCount.map((tag) => (
                                    <div key={tag.tid} className="tag-box tagNode">
                                        <span
                                            onClick={() => handleTagClick(tag.tid)}
                                            className="tag-link"
                                        >{tag.name}</span>
                                        <p>({tag.questionCount} questions)</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )

            )}
        </div>
    );
}
