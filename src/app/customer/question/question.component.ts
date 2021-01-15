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

  api;
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
    this.api = Api.getApi();
    this.collectionId = this.route.snapshot.paramMap.get('collectionId'); // This is if there is a url
    // this.collectionId = "5MDed2Wplvc" // The hardcoded version
    this.setCollectionNameFromApi().then(r => {
      this.tree = new Tree(this.collectionName);
    });
    this.firstQuestionInTree().then(() => {
      this.setCurrentAnswersFromApi().then(() => {
        this.updateIsFirstQuestion();
      });
    });
    this.isAnswered = false;
  }

  async setCollectionNameFromApi(): Promise<void> {
    const path = '/collection/' + this.collectionId;
    await this.api.get(path).then((responseData) => {
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

  async getFirstQuestionFromAPI(): Promise<Question> {
    let firstQuestion;
    let questionId;
    let questionText;
    const parentId = '0';
    const questionType = 'DropDown'; // ToDo enumeration maken

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
    this.setCurrentAnswersFromApi().then(r => {
      this.preselectedAnswer = node.getPreviousNode().getText();
      this.isAnswered = true;
      this.updateIsFirstQuestion();
    });
  }

  updateIsFirstQuestion(): void {
    if (this.tree.getCurrentNodeIndex() > 0) { // moet != zijn
      this.isFirstQuestion = false; // kijk hiernaar
    }
    this.isFirstQuestion = true;
  }
}
