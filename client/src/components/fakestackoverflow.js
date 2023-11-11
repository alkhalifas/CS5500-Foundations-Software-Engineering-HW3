import React, { useState } from 'react';
import Header from "./header/header";
import Menubar from "./menubar/menubar";
import "./fakestackoverflow.css"
import QuestionsList from "./main/questionList/questionsList";
import TagsList from "./main/tagsList/tagsList";
import TagQuestionsList from "./main/TagQuestionsList/TagQuestionsList";
import SearchResultsList from './main/searchResults/searchResultsList';

export default function FakeStackOverflow() {
    const [selectedComponent, setSelectedComponent] = useState('questions');
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchActive, setSearchActive] = useState(false);

    const handleComponentSelect = (component, tagId = null) => {
        setSelectedComponent(component);
        setSelectedTag(tagId);
        setSearchActive(false);
    };

    const renderComponent = () => {
        return searchActive
            ? <SearchResultsList searchInput={searchInput} />
            : (
                selectedComponent === 'questions' ? <QuestionsList />
                : selectedComponent === 'tags' ? <TagsList onSelect={tagId => handleComponentSelect('tagQuestions', tagId)} />
                : selectedComponent === 'tagQuestions' && selectedTag ? <TagQuestionsList tagId={selectedTag} />
                : null
            );
    };

    return (
        <div className="app-container">
            <Header setSearchInput={setSearchInput} setSearchActive={setSearchActive} />
            <div className="content-container">
                <Menubar onSelect={handleComponentSelect} />
                <div className="main-content">{renderComponent()}</div>
            </div>
        </div>
    );
}