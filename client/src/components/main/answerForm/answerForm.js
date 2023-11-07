import React, { useState } from 'react';
import "./answerForm.css"

export default function AnswerForm({ onSubmit }) {

    const initialFormData = {
        ansBy: '',
        text: '',
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

        // Username validation
        if (!data.ansBy.trim()) {
            errors.ansBy = "Username cannot be empty";
        }

        // Text validation
        if (!data.text.trim()) {
            errors.text = "Answer text cannot be empty";
        } else {
            // Hyperlinks Validation
            const regex = /\[(.*?)\]\((.*?)\)/g;
            const text = data.text;
            let match;
            while ((match = regex.exec(text)) !== null) {
                const hyperlinkName = match[1];
                const hyperlinkURL = match[2];
                if (!hyperlinkName.trim() || !hyperlinkURL.trim() || !hyperlinkURL.startsWith('https://')) {
                    errors.text = "Invalid hyperlink constraints";
                    break;
                }
            }
        }

        return errors;
    };

    return (
        <form id="newAnswerForm" onSubmit={handleSubmit}>
            <label>
                Username*
                <input
                    type="text"
                    id="answerUsernameInput"
                    name="ansBy"
                    value={formData.ansBy}
                    onChange={handleInputChange}
                    placeholder="Add username"
                />
                {validationErrors.ansBy && (
                    <div className="error-message">{validationErrors.ansBy}</div>
                )}
            </label>
            <label>
                Answer Text*
                <textarea
                    id="answerTextInput"
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

            <div className="button-container">
                <button type="submit" className="submit-button">Post Answer</button>
            </div>

            <div className="mandatory-text">* indicates mandatory fields</div>
        </form>
    );
}