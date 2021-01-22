import { Component, OnInit } from '@angular/core';
import { customizeUtil, MindMapMain } from 'mind-map';
import {Question} from '../../../shared/nodes/question.model';
import {Api} from '../../../api/api';
import {ActivatedRoute, Router} from '@angular/router';
import {Tree} from '../../../shared/nodes/tree.model';
import {NodeModel} from '../../../shared/nodes/node.model';
import {Answer} from '../../../shared/nodes/answer.model';
import {ApiServiceModel} from "../../../shared/api-service/api-service.model";

const HIERARCHY_RULES = {
  ROOT: {
    name: 'Collection',
    backgroundColor: '#7EC6E1',
    getChildren: () => [
      HIERARCHY_RULES.QUESTION,
      HIERARCHY_RULES.ANSWERS,
      HIERARCHY_RULES.NOTIFICATION
    ]
  },
  QUESTION: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS,
      HIERARCHY_RULES.NOTIFICATION
    ]
  },
  ANSWERS: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.NOTIFICATION
    ]
  },
  NOTIFICATION: {
    name: 'Notification',
    color: '#fff',
    backgroundColor: '#f5b7b1',
    getChildren: () => []
  }
};

const option = {
  container: 'jsmind_container',
  theme: 'normal',
  editable: true,
  selectable: false,
  depth: 4,
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

  async addNodesToTree(): Promise<void> {
    await this.getNodesFromApi().then(nodes => {
      for (const node of nodes) {
        this.tree.addNode(node);
      }
    });
  }

  addAllChildrenToMindMap(nodeId: string): void {
    const currentNode = this.mindMap.getNode(nodeId);
    const children = this.tree.getChildren(nodeId);
    for (const child of children) {
      this.mindMap.addNode(currentNode, child.getId(), child.getText());
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

  async initialiseMindMapData(): Promise<void> {
    await this.initialiseTree().then(async r => {
      await this.addNodesToTree().then(() => {
        this.mindMapData = this.tree.toMindMap();
      });
    });
  }

  async getNodesFromApi(): Promise<Array<NodeModel>> {
    const nodes: Array<NodeModel> = [];
    const firstQuestion = await this.getFirstQuestionFromApi();
    nodes.push(firstQuestion);
    const nodes2 = await this.getAllNodesFromApi2(firstQuestion);
    for (const node2 of nodes2) {
      if (node2.getId() !== undefined) {
        nodes.push(node2);
      }
    }
    return nodes;
  }

  async getAllNodesFromApi2(parentQuestion: Question): Promise<NodeModel[]> {
    const nodes: Array<NodeModel> = [];
    const answers = await this.getAnswersFromApi(parentQuestion.getId());
    for (const answer of answers) {
      nodes.push(answer);
      const question = await this.getQuestionFromApi(answer.getId());
      nodes.push(question);
      const children = await this.getAllNodesFromApi2(question);
      for (const child of children) {
        nodes.push(child);
      }
    }
    return nodes;
  }

  async getFirstQuestionFromApi(): Promise<Question> {
    let firstQuestion;
    const parentId = this.collectionId;
    const questionType = 'DropDown'; // ToDo enumeration maken
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
    const path = '/question/getByAnswer/' + answerId;
    let question;
    const questionType = 'DropDown';
    await this.apiService.getQuestionByAnswerId(answerId).then((questionData) => {
      // @ts-ignore
      question = new Question(questionData.id, questionData.name, answerId, questionType);
    });
    return question;
  }
}
