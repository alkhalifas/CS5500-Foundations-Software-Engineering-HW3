import React, {useEffect, useState} from 'react';
import dataModel from '../../../models/datamodel';
import "./tagsList.css"
import QuestionForm from "../questionForm/questionForm";
import TagQuestionsList from "../TagQuestionsList/TagQuestionsList";
import axios from "axios"; // Import the TagQuestionsList component

export default function TagsList() {
    const [showForm, setShowForm] = useState(false);
    const [selectedTag, setSelectedTag] = useState(false);
    // const tagsWithQuestionCount = dataModel.getAllTagsWithQuestionCount();
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const apiUrl = 'http://localhost:8000/tags-with-count';
        axios.get(apiUrl)
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }, []);

    console.log("tags: ", tags)


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
                                <h3>{tags.length} Tags</h3>
                                <h1>All Tags</h1>
                                <button className={"ask-question-button"} onClick={handleAskQuestion}>Ask a Question</button>
                            </div>

                            <div className="tags-container">
                                {tags.map((tag) => (
                                    <div key={tag._id} className="tag-box tagNode">
                                        <span
                                            onClick={() => handleTagClick(tag._id)}
                                            className="tag-link"
                                        >{tag.name}</span>
                                        <p>({tag.count} questions)</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )

            )}
        </div>
    );
}
