[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Mvibic7M)
# Homework 2
Read the HW specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/Ee5EyOzz3KlPoaqm2IFtL0YBfD9GE204MLqmaTNKiIEOSQ?e=CSPCfb).

## Team Member 1 Contribution (Saleh)
- [X] Home Page
- [X] View Questions for Tag
- [X] Tags Page
- [X] View Question
- [X] Data Model
- [X] Diagrams

## Team Member 2 Contribution (Vidhi)
- [X] Add Answer
- [X] Add Question
- [X] Searching
- [X] Sorting
- [X] Hyperlink Support


## Design Patterns:

1. Facade: We followed a facade pattern within the dataModel.js, within various functions such as addQuestion or addAnswer in the sense that we added all the complexities involved in the functionality under a method of that class. Another example is AnswerCardTiming.js and QuestionCardTiming.js in which we hid the complex logic of rendering time into a component that we can easily call.
2. Singletonian: Within dataModel.js, we implemented a singletonian pattern in the sense that we have only one instance of our data, and pass that around throughout the application. We can see the single instance being enforced within the getInstance() method.

