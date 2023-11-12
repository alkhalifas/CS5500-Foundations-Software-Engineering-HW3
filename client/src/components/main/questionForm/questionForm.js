import React, { useState } from 'react';
import "./questionForm.css"

export default function QuestionForm({ onSubmit }) {

    const initialFormData = {
        title: '',
        text: '',
        tags: '',
        asked_by: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear validation error for the input that's being changed
        setValidationErrors({ ...validationErrors, [name]: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm(formData);
        if (Object.keys(errors).length === 0) {
            onSubmit(formData);
            setFormData(initialFormData);
        } else {
            setValidationErrors(errors);
        }
    };

    const validateForm = (data) => {
        const errors = {};

        // Title validation
        if (!data.title.trim()) {
            errors.title = "Title cannot be empty";
        } else if (data.title.length > 100) {
            errors.title = "Title cannot be more than 100 characters";
        }

        // Text validation
        if (!data.text.trim()) {
            errors.text = "Question text cannot be empty";
        } else {
            // Hyperlinks Validation
            const regex = /\[(.*?)\]\((.*?)\)/g;
            const text = data.text;
            let match;
            while ((match = regex.exec(text)) !== null) {
                const hyperlinkName = match[1];
                const hyperlinkURL = match[2];
                if (!hyperlinkName.trim() || !hyperlinkURL.trim() || !hyperlinkURL.startsWith('https://')) {
                    errors.text = "Invalid hyperlink";
                    break;
                }
            }
        }

        // Tags validation
        if (!data.tags.trim()) {
            errors.tags = "Tags cannot be empty";
        }

        const tagNames = data.tags.trim().split(/\s+/);
        if (tagNames.length > 5) {
            errors.tags = "Cannot have more than 5 tags";
        }
        for (const tag of tagNames) {
            if (tag.length > 20) {
                errors.tags = "New tag length cannot be more than 20";
                break;
            }
        }

        // Username validation
        if (!data.asked_by.trim()) {
            errors.asked_by = "Username cannot be empty";
        }

        return errors;
    };

    return (
        <form id="newQuestionForm" onSubmit={handleSubmit}>
            <label>
                Question Title*
                <input
                    type="text"
                    id="formTitleInput"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Limit title to 100 characters or less"
                />
                {validationErrors.title && (
                    <div className="error-message">{validationErrors.title}</div>
                )}
            </label>
            <label>
                Question Text*
                <textarea
                    id="formTextInput"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="Add details"
                    rows="10"
                />
                {validationErrors.text && (
                    <div className="error-message">{validationErrors.text}</div>
                )}
            </label>
            <label>
                Tags*
                <input
                    type="text"
                    id="formTagInput"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Add keywords separated by whitespace"
                    //required
                />
                {validationErrors.tags && (
                    <div className="error-message">{validationErrors.tags}</div>
                )}
            </label>
            <label>
                Username*
                <input
                    type="text"
                    id="formUsernameInput"
                    name="asked_by"
                    value={formData.asked_by}
                    onChange={handleInputChange}
                    placeholder="Add username"
                />
                {validationErrors.asked_by && (
                    <div className="error-message">{validationErrors.asked_by}</div>
                )}
            </label>

            <div className="button-container">
                <button type="submit" className="submit-button">Post Question</button>
            </div>

            <div className="mandatory-text">* indicates mandatory fields</div>
        </form>
    );
}