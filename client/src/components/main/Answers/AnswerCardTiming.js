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

export default function AnswerCardTiming({ answer }) {
    const ansDate = new Date(answer.ans_date_time);
    const now = new Date();

    const timeDifference = Math.floor((now - ansDate) / 1000);

    let metadata = '';
    if (timeDifference < 60) {
        metadata = `asked ${timeDifference} seconds ago`;
    } else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60);
        metadata = `asked ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifference < 86400) {
        const hours = Math.floor(timeDifference / 3600);
        metadata = `asked ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (now.getDate() === ansDate.getDate() && now.getMonth() === ansDate.getMonth() && now.getFullYear() === ansDate.getFullYear()) {
        const formattedTime = formatTime(ansDate);
        metadata = `asked today at ${formattedTime}`;
    } else if (now.getFullYear() === ansDate.getFullYear()) {
        const formattedDate = formatDate(ansDate);
        const formattedTime = formatTime(ansDate);
        metadata = `asked ${formattedDate} at ${formattedTime}`;
    } else {
        const formattedDate = formatDate(ansDate);
        const formattedTime = formatTime(ansDate);
        metadata = `asked ${formattedDate}, ${ansDate.getFullYear()} at ${formattedTime}`;
    }

    return (
        <div className="answer-card-timing">
            <span className="answered-by" style={{ color: 'blue' }}>{answer.ans_by}</span> {metadata}
        </div>
    );
}
