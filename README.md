[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8-yb8gCE)
# Homework 3

Read homework specifications [here](https://northeastern-my.sharepoint.com/:w:/r/personal/j_mitra_northeastern_edu/Documents/cs%205500/CS5500%20Foundations%20of%20Software%20Engineering.docx?d=wf0fe626cdd1e44558d38e6e595b6e433&csf=1&web=1&e=EDdUEu).

In the sections below, list and describe each contribution briefly.

## Team Member 1 Contribution (Saleh)
- [X] Schemas
- [X] Populate Integration
- [X] Server API Routes
- [X] MongoDB Integration
- [X] Server Requirements
- [X] Tags Page
- [X] Questions Per Tag Page
- [X] Navigation Pane on left
- [X] Design Diagram - Except add question add answer since Vidhi will implement factory pattern
- [X] Remove .idea
- [X] Testing

## Team Member 2 Contribution (Vidhi)
- [x] Questions List
- [X] Answers List
- [x] Create Question
- [X] Answer Question
- [X] Search 
- [X] Sort
- [ ] Factory pattern
- [ ] Clean up

## Outstanding:
- [X] Resolve A2 issues


## Design Patterns:
1. Facade Pattern: We followed a facade pattern within the routes of our application, such that within various functions like addQuestion or addAnswer in the sense that we added all the complexities involved in the functionality under a method of that class. Another example is AnswerCardTiming.js and QuestionCardTiming.js in which we hid the complex logic of rendering time into a component that we can easily call.
2. Factory Pattern:


*Add your team's class and sequence diagrams to the design directory*. It is enough to document the design of the server. You can assume the client to be an external entity that will trigger events in the server.

You will get 10% extra credit if you implement design patterns and explain how you have used them in this README.

## Steps to Run:

    # Start Mongod
    mongod --config /opt/homebrew/etc/mongod.conf --fork

    # Populate the Database
    node populate_db.js mongodb://127.0.0.1:27017/fake_so
