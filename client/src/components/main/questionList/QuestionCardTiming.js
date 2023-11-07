import React from 'react';

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];

    return `${month} ${day}`;
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export default function QuestionCardTiming({ question }) {
    const askDate = new Date(question.askDate);
    const now = new Date();

    const timeDifference = Math.floor((now - askDate) / 1000);

    let metadata = '';
    if (timeDifference < 60) {
        metadata = `asked ${timeDifference} seconds ago`;
    } else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60);
        metadata = `asked ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifference < 86400) {
        const hours = Math.floor(timeDifference / 3600);
        metadata = `asked ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (now.getDate() === askDate.getDate() && now.getMonth() === askDate.getMonth() && now.getFullYear() === askDate.getFullYear()) {
        const formattedTime = formatTime(askDate);
        metadata = `asked today at ${formattedTime}`;
    } else if (now.getFullYear() === askDate.getFullYear()) {
        const formattedDate = formatDate(askDate);
        const formattedTime = formatTime(askDate);
        metadata = `asked ${formattedDate} at ${formattedTime}`;
    } else {
        const formattedDate = formatDate(askDate);
        const formattedTime = formatTime(askDate);
        metadata = `asked ${formattedDate}, ${askDate.getFullYear()} at ${formattedTime}`;
    }

    return (
        <div className="question-card-timing">
            <span className="asked-by">{question.askedBy}</span> {metadata}
        </div>
    );
}
