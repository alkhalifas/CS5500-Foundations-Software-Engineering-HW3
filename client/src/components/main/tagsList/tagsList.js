import React, {useEffect, useState} from 'react';
import "./tagsList.css"
import QuestionForm from "../questionForm/questionForm";
import TagQuestionsList from "../TagQuestionsList/TagQuestionsList";
import axios from "axios"; // Import the TagQuestionsList component

export default function TagsList() {
    const [showForm, setShowForm] = useState(false);
    const [selectedTag, setSelectedTag] = useState(false);
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

    const handleAskQuestion = () => {
        setShowForm(true);
    };

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        console.log("handleTagClick: ", tag)
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

    return (
        <div>
            {showForm ? (
                <QuestionForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
            ) : (
                selectedTag ? (
                        <TagQuestionsList tag={selectedTag} />
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
                                            onClick={() => handleTagClick(tag)}
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