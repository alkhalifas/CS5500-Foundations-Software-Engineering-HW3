[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8-yb8gCE)
# Homework 3

Read homework specifications [here](https://northeastern-my.sharepoint.com/:w:/r/personal/j_mitra_northeastern_edu/Documents/cs%205500/CS5500%20Foundations%20of%20Software%20Engineering.docx?d=wf0fe626cdd1e44558d38e6e595b6e433&csf=1&web=1&e=EDdUEu).

In the sections below, list and describe each contribution briefly.

## Team Member 1 Contribution
- [X] Schemas
- [X] Populate Integration
- [X] Server API Routes
- [X] MongoDB Integration
- [X] Server Requirements
- [X] Tags Page
- [ ] Questions Per Tag Page

## Team Member 2 Contribution
- [x] Questions List
- [X] Answers List
- [x] Create Question
- [X] Answer Question
- [X] Search 
- [X] Sort

*Add your team's class and sequence diagrams to the design directory*. It is enough to document the design of the server. You can assume the client to be an external entity that will trigger events in the server.

You will get 10% extra credit if you implement design patterns and explain how you have used them in this README.

## Steps to Run:

    # Start Mongod
    mongod --config /opt/homebrew/etc/mongod.conf --fork

    # Populate the Database
    node populate_db.js mongodb://127.0.0.1:27017/fake_so
