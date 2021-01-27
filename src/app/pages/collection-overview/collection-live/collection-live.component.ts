import { Component, OnInit } from '@angular/core';
import { customizeUtil, MindMapMain } from 'mind-map';
import {Question} from '../../../shared/nodes/question.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Tree} from '../../../shared/nodes/tree.model';
import {NodeModel} from '../../../shared/nodes/node.model';
import {Answer} from '../../../shared/nodes/answer.model';
import {ApiServiceModel} from '../../../shared/api-service/api-service.model';

const HIERARCHY_RULES = {
  ROOT: {
    name: 'Collection',
    backgroundColor: '#7EC6E1',
    getChildren: () => [
      HIERARCHY_RULES.QUESTION
    ]
  },
  QUESTION: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS
    ]
  },
  ANSWERS: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.NOTIFICATION,
      HIERARCHY_RULES.QUESTION
    ]
  },
  NOTIFICATION: {
    name: 'Notification',
    color: '#fff',
    backgroundColor: '#f5b7b1',
    getChildren: () => [
      HIERARCHY_RULES.END_NOTIFICATION
    ]
  },
  END_NOTIFICATION: {
    name: 'endNotification',
    color: '#fff',
    backgroundColor: '#f8f',
    getChildren: () => []
  }
};

const option = {
  container: 'jsmind_container',
  theme: 'normal',
  editable: true,
  selectable: false,
  depth: 6,
  hierarchyRule: HIERARCHY_RULES,
  enableDraggable: true,
};

const mind2 = {
  format: 'nodeTree',
  data: {
    id: 1,
    topic: 'Reisvoucher 2021',
    selectedType: false,
    backgroundColor: '#7EC6E1',
    children: []
  }
};

const mind = {
  format: 'nodeTree',
  data: {
    id: '5MDed2Wplvc',
    topic: 'Reisvoucher 2021',
    selectedType: false,
    backgroundColor: '#7EC6E1',
    children: [
      {
        id: 80,
        color: '#fff',
        topic: 'show room',
        direction: 'right',
        selectedType: 'Question',
        backgroundColor: '#616161',
        children: []
      },
      {
        id: 44,
        color: '#fff',
        topic: 'Iets',
        direction: 'right',
        selectedType: 'Question',
        backgroundColor: '#616161',
        children: [
          {
            id: 46,
            color: '#fff',
            topic: 'Iets anders',
            direction: 'right',
            selectedType: 'Answer',
            backgroundColor: '#989898',
            children: [
              {
                id: 49,
                color: '#fff',
                topic: 'Nog iets',
                direction: 'right',
                selectedType: 'Question',
                backgroundColor: '#C6C6C6',
                children: []
              },
              {
                id: 51,
                color: '#fff',
                topic: 'Weer iets',
                direction: 'right',
                selectedType: 'Question',
                backgroundColor: '#C6C6C6',
                children: []
              },
              {
                id: 47,
                color: '#fff',
                topic: 'Een topic',
                direction: 'right',
                selectedType: 'Question',
                backgroundColor: '#C6C6C6',
                children: []
              },
              {
                id: 48,
                color: '#fff',
                topic: 'Nog een topic',
                direction: 'right',
                selectedType: 'Question',
                backgroundColor: '#C6C6C6',
                children: []
              },
              {
                id: 50,
                color: '#fff',
                topic: 'Oeh!',
                direction: 'right',
                selectedType: 'Question',
                backgroundColor: '#C6C6C6',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 45,
        color: '#fff',
        topic: 'Hey, jij hier?',
        direction: 'right',
        selectedType: 'Question',
        backgroundColor: '#616161',
        children: []
      }
    ]
  }
};

const DROP_DOWN_STRING = 'DropDown';

@Component({
  selector: 'app-root',
  templateUrl: './collection-live.component.html',
  styleUrls: ['./collection-live.component.scss']
})
export class CollectionLiveComponent implements OnInit {
  mindMap;
  mindMapData;
  apiService: ApiServiceModel;
  tree: Tree;
  collectionName: string;
  collectionId: string;
  expected: string;
  result: string;
  firstNodeId: string;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.apiService = new ApiServiceModel();
    // await this.setCollectionNameFromApi();
    await this.initialiseMindMapData().then(() => {
      this.mindMap = MindMapMain.show(option, this.mindMapData);
      this.setFirstQuestionMindMap();
      this.addNodesToMindMap();
    });
  }

  removeNode(): void {
    const selectedNode = this.mindMap.getSelectedNode();
    const selectedId = selectedNode && selectedNode.id;

    if (!selectedId) {
      return;
    }
    this.mindMap.removeNode(selectedId);
  }

  addNode(): void {
    const selectedNode = this.mindMap.getSelectedNode();
    if (!selectedNode) {
      return;
    }

    const nodeId = customizeUtil.uuid.newid();
    this.mindMap.addNode(selectedNode, nodeId);
  }

  getMindMapData(): string {
    const data = this.mindMap.getData().data;
    console.log('data: ', data);
    return data;
  }

  setCollectionIdFromUrl(): void {
    this.collectionId = this.route.snapshot.paramMap.get('collectionId');
  }

  async setCollectionNameFromApi(): Promise<void> {
    await this.apiService.getCollectionById(this.collectionId).then((collectionData) => {
      // @ts-ignore
      this.collectionName = collectionData.name;
    });
  }

  async initialiseTree(): Promise<void> {
    this.setCollectionIdFromUrl();
    await this.setCollectionNameFromApi().then(() => {
      this.tree = new Tree(this.collectionName, this.collectionId);
    });
  }

  async addNodesToTreeOld(): Promise<void> {
    await this.getNodesFromApiOld().then(nodes => {
      for (const node of nodes) {
        this.tree.addNode(node);
      }
    });
  }

  addAllChildrenToMindMap(nodeId: string): void {
    const currentNode = this.mindMap.getNode(nodeId);
    const children = this.tree.getChildren(nodeId);
    for (const child of children) {
      console.log('Adding child: ', child);
      this.addNodeToMindMap(currentNode, child);
      // this.mindMap.addNode(currentNode, child.getId(), child.getText());
      this.addAllChildrenToMindMap(child.getId());
    }
  }

  addNodesToMindMap(): void {
    this.addAllChildrenToMindMap(this.firstNodeId);
  }

  setFirstQuestionMindMap(): void {
    if (this.tree.size() === 0) {
      return;
    }
    const rootNode = this.mindMap.getNode(this.collectionId);
    const firstQuestion = this.tree.getRoot();
    this.mindMap.addNode(rootNode, firstQuestion.getId(), firstQuestion.getText());
    this.firstNodeId = firstQuestion.getId();
  }

  addNodeToMindMap(parentNode: any, node: NodeModel): void {
    this.mindMap.addNode(parentNode, node.getId(), node.getText());
    this.mindMap.setNodeColor(node.getId(), node.getMindMapBackGroundColor(), node.getMindMapColor());
  }

  async initialiseMindMapData(): Promise<void> {
    await this.initialiseTree().then(async r => {
      await this.addNodesToTreeFromApi().then(() => {
        this.mindMapData = this.tree.toMindMap();
      });
      // await this.addNodesToTreeOld().then(() => {
      //   this.mindMapData = this.tree.toMindMap();
      // });
    });
  }

  async getNodesFromApiOld(): Promise<Array<NodeModel>> {
    const nodes: Array<NodeModel> = [];
    const firstQuestion = await this.getFirstQuestionFromApi();
    nodes.push(firstQuestion);
    const nodes2 = await this.getAllNodesFromApiOld2(firstQuestion);
    for (const node2 of nodes2) {
      if (node2.getId() !== undefined) {
        nodes.push(node2);
      }
    }
    return nodes;
  }

  async getAllNodesFromApiOld2(parentQuestion: Question): Promise<NodeModel[]> {
    const nodes: Array<NodeModel> = [];
    const answers = await this.getAnswersFromApi(parentQuestion.getId());
    for (const answer of answers) {
      nodes.push(answer);
      const question = await this.getQuestionFromApi(answer.getId());
      nodes.push(question);
      const children = await this.getAllNodesFromApiOld2(question);
      for (const child of children) {
        nodes.push(child);
      }
    }
    return nodes;
  }

  async getFirstQuestionFromApi(): Promise<Question> {
    let firstQuestion;
    const parentId = this.collectionId;
    // const questionType = Question.getDropDownTypeString();
    const questionType = DROP_DOWN_STRING;
    await this.apiService.getFirstQuestionByCollectionId(this.collectionId).then((firstQuestionData) => {
      // @ts-ignore
      const questionId = firstQuestionData.id;
      // @ts-ignore
      const questionText = firstQuestionData.name;
      firstQuestion = new Question(questionId, questionText, parentId, questionType);
    });
    return firstQuestion;
  }

  async getAnswersFromApi(questionId: string): Promise<Answer[]> {
    const answers = [];
    await this.apiService.getAnswersByQuestionId(questionId).then((answersData) => {
      // @ts-ignore
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < answersData.length; i++) {
        // @ts-ignore
        const answer = new Answer(answersData[i].id, answersData[i].name, questionId);
        answers.push(answer);
      }
    });
    return answers;
  }

  async getQuestionFromApi(answerId: string): Promise<Question> {
    let question;
    // const questionType = Question.getDropDownTypeString();
    const questionType = DROP_DOWN_STRING;
    await this.apiService.getQuestionByAnswerId(answerId).then((questionData) => {
      // @ts-ignore
      question = new Question(questionData.id, questionData.name, answerId, questionType);
    });
    return question;
  }

  async addNodesToTreeFromApi(): Promise<void> {
    await this.apiService.getAllDataFromACollection(this.collectionId).then((allCollectionData) => {
      this.extractFirstQuestion(allCollectionData);
    });
  }

  extractFirstQuestion(allCollectionData: object): void {
    // @ts-ignore
    const refinedCollectionData = allCollectionData.question;
    // @ts-ignore
    const id = refinedCollectionData.id;
    // @ts-ignore
    const text = refinedCollectionData.name;
    const parentId = this.collectionId;
    const questionType = DROP_DOWN_STRING;
    const firstQuestion = new Question(id, text, parentId, questionType);
    this.tree.addNode(firstQuestion);
    this.extractAnswers(refinedCollectionData);
  }

  extractAnswers(data: object): void {
    // @ts-ignore
    const answersData = data.answers;
    if (answersData.length === 0) {
      return;
    }
    // @ts-ignore
    const parentId = data.id;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < answersData.length; i++) {
      const answer = new Answer(answersData[i].id, answersData[i].name, parentId);
      this.tree.addNode(answer);
      this.extractQuestions(answersData[i]);
    }
  }

  extractQuestions(data: object): void {
    // @ts-ignore
    const questionData = data.question;
    if (questionData === undefined) {
      return;
    }
    const questionType = DROP_DOWN_STRING;
    // @ts-ignore
    const question = new Question(questionData.id, questionData.name, data.id, questionType);
    this.tree.addNode(question);
    this.extractAnswers(questionData);
  }
}
