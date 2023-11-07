import React, { useState } from "react";
import "./menubar.css"

export default function Menubar({ onSelect }) {
    const [selectedButton, setSelectedButton] = useState("questions");

    const handleButtonClick = (button) => {
        setSelectedButton(button);
        onSelect(button);
    };

    return (
        <aside className="menu sideBarNav" id={"sideBarNav"}>
            <button
                className={selectedButton === "questions" ? "menu-btn dark-active" : "menu-btn"}
                onClick={() => handleButtonClick("questions")}
            >
                Questions
            </button>
            <button
                className={selectedButton === "tags" ? "menu-btn dark-active" : "menu-btn"}
                onClick={() => handleButtonClick("tags")}
            >
                Tags
            </button>
        </aside>
    );
}
