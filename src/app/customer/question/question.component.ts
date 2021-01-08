import {Component, OnInit} from '@angular/core';
import {Question} from '../Nodes/question.model';
import {Tree} from '../Nodes/tree.model';
import {Answer} from '../Nodes/answer.model';
import {NodeModel} from '../Nodes/node.model';
import {HttpClient} from '@angular/common/http';

import {ActivatedRoute, Router} from '@angular/router';
import {Api} from '../../api/api';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  api = Api.getApi();
  tree: Tree;
  currentAnswers: Answer[];
  isFirstQuestion: boolean;
  isAnswered: boolean;
  preselectedAnswer: string;
  collectionId: string;
  collectionName: string;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('collectionId');
    this.setCollectionNameFromApi().then(r => {
      this.tree = new Tree(this.collectionName);
    });
    this.firstQuestionInTree().then(r => {
      this.setCurrentAnswersFromApi().then(s => {
        this.updateIsFirstQuestion();
      });
    });
    this.isAnswered = false;
  }

  async setCollectionNameFromApi(): Promise<void> {
    const path = '/collection/' + this.collectionId;
    const api = Api.getApi();
    await api.get(path).then((responseData) => {
      this.collectionName = responseData.data.result.name;
    });
  }

  async firstQuestionInTree(): Promise<void> {
    const firstQuestion = await this.getFirstQuestionFromAPI();
    this.tree.addNode(firstQuestion);
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

  async getFirstQuestionFromAPI(): Promise<Question> {
    let firstQuestion;
    let questionId;
    let questionText;
    const parentId = '0';
    const questionType = 'DropDown';

    const path = '/question/getByCollection/' + this.collectionId;
    await this.api.get(path).then((responseData) => {
      questionId = responseData.data.result.id;
      questionText = responseData.data.result.name;
    });
    firstQuestion = new Question(questionId, questionText, parentId, questionType);
    return firstQuestion;
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

  async setCurrentAnswersFromApi(): Promise<void> {
    this.currentAnswers = [];
    const currentQuestionId = this.tree.getCurrentNode().getId();
    const path = '/answer/getByQuestion/' + currentQuestionId;
    await this.api.get(path).then((responseData) => {
      const answers = responseData.data.result;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < answers.length; i++) {
        const answer = new Answer(answers[i].id, answers[i].name, currentQuestionId);
        this.currentAnswers.push(answer);
      }
    });
  }

  nextQuestionExists(answer: Answer): boolean {
    // ToDo check this with api
    switch (answer.getId()) {
      case '2':
        return true;
      case '3':
        return true;
    }
    return false;
  }

  async getNextQuestionDataApi(answer: Answer): Promise<'object'> {
    const path = '/question/getByAnswer/' + answer.getId();
    let refinedData;
    await this.api.get(path).then((responseData) => {
      refinedData = responseData.data.result;
    });
    return refinedData;
  }

  async nextQuestionExistsApi(questionData: 'object'): Promise<boolean> {
    let exist = true;
    if (!questionData) {
      exist = false;
    }
    return exist;
  }

  getNextQuestion(answer: Answer): Question {
    // ToDo get next question from api
    const questionId = '8';
    const questionText = 'Wat is uw situatie?';
    const parentId = '4';
    const questionType = 'DropDown';
    return new Question(questionId, questionText, parentId, questionType);
  }

  getNextQuestionFromData(questionData: 'object', previousNode: NodeModel): Question {
    // @ts-ignore
    const questionId = questionData.id;
    // @ts-ignore
    const questionText = questionData.name;
    const parentId = previousNode.getId();
    const questionType = 'DropDown';
    return new Question(questionId, questionText, parentId, questionType);
  }

  async onNextQuestionClicked(answer: Answer): Promise<void> {
    const questionData = await this.getNextQuestionDataApi(answer);
    const answerExists = await this.nextQuestionExistsApi(questionData);
    if (answerExists) {
      const question = this.getNextQuestionFromData(questionData, answer);
      question.setPreviousNode(answer);
      this.tree.addNode(question);
      await this.setCurrentAnswersFromApi();
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
