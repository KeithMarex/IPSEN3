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
      HIERARCHY_RULES.QUESTION,
      HIERARCHY_RULES.NOTIFICATION
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
    getChildren: () => [
    ]
  },
  QUESTION1: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS1
    ]
  },
  ANSWERS1: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.NOTIFICATION,
      HIERARCHY_RULES.QUESTION
    ]
  },
  QUESTION2: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS
    ]
  },
  ANSWERS3: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.NOTIFICATION,
      HIERARCHY_RULES.QUESTION
    ]
  },
  QUESTION3: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS
    ]
  },
  ANSWERS4: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.NOTIFICATION,
      HIERARCHY_RULES.QUESTION
    ]
  },
  QUESTION4: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS
    ]
  },
  ANSWERS5: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.NOTIFICATION,
      HIERARCHY_RULES.QUESTION
    ]
  },
  QUESTION5: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS
    ]
  },
  ANSWERS6: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.NOTIFICATION,
      HIERARCHY_RULES.QUESTION
    ]
  }
};

const option = {
  container: 'jsmind_container',
  theme: 'normal',
  editable: true,
  selectable: false,
  depth: 15,
  hierarchyRule: HIERARCHY_RULES,
  enableDraggable: true,
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

  backClicked(): void {
    const dashboardUrl = 'admin/dashboard';
    this.router.navigate([dashboardUrl]);
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

  addAllChildrenToMindMap(nodeId: string): void {
    const currentNode = this.mindMap.getNode(nodeId);
    const children = this.tree.getChildren(nodeId);
    for (const child of children) {
      console.log('Current node', currentNode);
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
    });
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
