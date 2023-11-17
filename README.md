[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8-yb8gCE)
# Homework 3

Read homework specifications [here](https://northeastern-my.sharepoint.com/:w:/r/personal/j_mitra_northeastern_edu/Documents/cs%205500/CS5500%20Foundations%20of%20Software%20Engineering.docx?d=wf0fe626cdd1e44558d38e6e595b6e433&csf=1&web=1&e=EDdUEu).

## Team Member 1 Contribution (Saleh)
- [X] Schemas
- [X] Populate Integration
- [X] Server API Routes
- [X] MongoDB Integration
- [X] Server Requirements
- [X] Tags Page
- [X] Questions Per Tag Page
- [X] Design Diagram
- [X] Testing

## Team Member 2 Contribution (Vidhi)
- [x] Questions List
- [X] Answers List
- [x] Create Question
- [X] Answer Question
- [X] Search 
- [X] Sort
- [X] Design Patterns

## Design Patterns:
1. Facade Pattern: We followed a facade pattern within the routes of our application, such that within various functions like addQuestion or addAnswer in the sense that we added all the complexities involved in the functionality under a method of that class. Another example is AnswerCardTiming.js and QuestionCardTiming.js in which we hid the complex logic of rendering time into a component that we can easily call.
2. Observer Pattern: We use event listeners for the MongoDB connection to handle events relating to connections. This can be thought of as a form of an observer pattern in the sense that our database connection maintains a list of listeners, specifically to notify of a state change.
3. Singleton Pattern: Since we are using a single instance of our mongoose connection (db) to interact with the MongoDB database, we can think of this as following a singleton pattern, since we have a single instance that is responsible for managing a global resource.
4. Factory Pattern: The Factory Pattern is implemented in the code through the elementFactory module. This module provides a create_element function that acts as a factory for creating instances of different types of elements (Question, Answer, Tag). The factory function takes a type parameter and parameters object, where type specifies the type of element to create, and parameters contains the data needed to initialize the element.

## Steps to Run:

    # Start Mongod

    mongod --config /opt/homebrew/etc/mongod.conf --fork

    # Populate the Database

    node populate_db.js mongodb://127.0.0.1:27017/fake_so

    # Run Cypress - To align with best practices as best as we can, we recycled and made use
    # of the cypress tests given to us in A2, and adjusted them to be used with this new implementation.

    cd client
    npx cypress open
