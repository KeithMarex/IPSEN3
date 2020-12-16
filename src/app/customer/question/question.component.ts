import { Component, OnInit } from '@angular/core';
import {Question} from '../Nodes/question.model';
import {Tree} from '../Nodes/tree.model';
import {Answer} from '../Nodes/answer.model';
import {NodeModel} from '../Nodes/node.model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  tree: Tree;
  currentAnswers: Answer[];
  isFirstQuestion: boolean;
  isAnswered: boolean;
  preselectedAnswer: string;

  constructor() {
  }

  ngOnInit(): void {
    const collectionName = 'Reisvoucher'; // ToDo set collectionName
    this.tree = new Tree(collectionName);
    this.tree.addNode(this.getFirstQuestion());
    this.setCurrentAnswers();
    this.updateIsFirstQuestion();
    this.isAnswered = false;
  }

  getCollectionName(): string {
    return this.tree.getCollectionName();
  }

  getFirstQuestion(): Question {
    // ToDo get question data from api
    const questionId = '1';
    const questionText = 'Waarmee kan ik u helpen?';
    const parentId = '0';
    const questionType = 'DropDown';
    return new Question(questionId, questionText, parentId, questionType);
  }

  getCurrentQuestionText(): string {
    return this.tree.getCurrentNode().getText();
  }

  setCurrentAnswers(): void {
    // ToDo gets answers from api and sets it in currentAnswers
    switch (this.tree.getCurrentNode().getId()) {
      case '1':
        this.currentAnswers = [
          new Answer('2', 'Ik wil geld in plaats van een voucher', '1'),
          new Answer('3', 'Moet ik mijn voucher accepteren?', '1'),
          new Answer('4', 'Ik wil mijn reis annuleren, wat zijn mijn rechten?', '1'),
          new Answer('5', 'Ik kom terug uit code oranje', '1'),
          new Answer('6', 'Overig', '1'),
          new Answer('7', 'Mijn optie staat er niet bij', '1'),
        ];
        break;
      case '8':
        this.currentAnswers = [
          new Answer('9', 'Ik wil geld in plaats van een voucher', '1'),
          new Answer('11', 'Moet ik mijn voucher accepteren?', '1'),
          new Answer('12', 'Ik wil mijn reis annuleren, wat zijn mijn rechten?', '1'),
        ];
        break;
    }
  }

  nextQuestionExists(answer: Answer): boolean {
    // ToDo check this with api
    switch (answer.getId()) {
      case '2':
        return true;
        break;
      case '3':
        return true;
        break;
    }
    return false;
  }

  getNextQuestion(answer: Answer): Question {
    // ToDo get next question from api
    const questionId = '8';
    const questionText = 'Wat is uw situatie?';
    const parentId = '4';
    const questionType = 'DropDown';
    return new Question(questionId, questionText, parentId, questionType);
  }

  onNextQuestionClicked(answer: Answer): void {
    if (this.nextQuestionExists(answer)) {
      const question = this.getNextQuestion(answer);
      question.setPreviousNode(answer);
      this.tree.addNode(question);
      this.setCurrentAnswers();
      this.updateIsFirstQuestion();
      this.isAnswered = false;
    }
  }

  onPreviousQuestionClicked(): void {
    const node: NodeModel = this.tree.pop();
    this.setCurrentAnswers();
    this.preselectedAnswer = node.getPreviousNode().getText();
    this.isAnswered = true;
    this.updateIsFirstQuestion();
  }

  updateIsFirstQuestion(): void {
    if (this.tree.getCurrentNodeIndex() > 0) {
      this.isFirstQuestion = false;
    }
    this.isFirstQuestion = true;
  }
}
