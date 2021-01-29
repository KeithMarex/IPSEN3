import {Component, Input, OnInit} from '@angular/core';
import {MindMapMain} from 'mind-map';
import {Question} from '../../../shared/nodes/question.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Tree} from '../../../shared/nodes/tree.model';
import {NodeModel} from '../../../shared/nodes/node.model';
import {Answer} from '../../../shared/nodes/answer.model';
import {ApiServiceModel} from '../../../shared/api-service/api-service.model';
import {DuplicateColors} from '../../../shared/nodes/duplicate-colors.model';
import {CollectionModel} from '../../../shared/models/collection.model';
import {Notification} from '../../../shared/nodes/notification.model';

const HIERARCHY_RULES = {
  ROOT: {
    name: 'Collection',
    backgroundColor: '#7EC6E1',
    getChildren: () => [
      HIERARCHY_RULES.QUESTIONS
    ]
  },
  QUESTIONS: {
    name: 'Question',
    color: '#fff',
    backgroundColor: '#f4d03f',
    getChildren: () => [
      HIERARCHY_RULES.ANSWERS,
      HIERARCHY_RULES.DOUBLE_NODE
    ]
  },
  ANSWERS: {
    name: 'Answer',
    color: '#fff',
    backgroundColor: '#f9e79f',
    getChildren: () => [
      HIERARCHY_RULES.QUESTIONS,
      HIERARCHY_RULES.NOTIFICATION,
      HIERARCHY_RULES.DOUBLE_NODE
    ]
  },
  NOTIFICATION: {
    name: 'Notification',
    color: '#fff',
    backgroundColor: '#f5b7b1',
    getChildren: () => [
      HIERARCHY_RULES.QUESTIONS,
      HIERARCHY_RULES.END_NOTIFICATION,
      HIERARCHY_RULES.DOUBLE_NODE
    ]
  },
  END_NOTIFICATION: {
    name: 'endNotification',
    color: '#fff',
    backgroundColor: '#f8f',
    getChildren: () => [
    ]
  },
  DOUBLE_NODE: {
    name: 'duplicateNode',
    color: '#f00',
    backgroundColor: '#0ff',
    getChildren: () => [
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
  selector: 'app-collection-live',
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
  linkedNodeCount: number;
  @Input() collection: CollectionModel;

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

  // @ts-ignore
  backClicked(): void {
    const dashboardUrl = 'admin/dashboard';
    this.router.navigate([dashboardUrl]);
  }

  setCollectionIdFromUrl(): void {
    this.collectionId = this.collection.id;
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
      if (this.nodeIdExists(child)) {
        if (this.isDifferentParent(currentNode, child)) {
          this.addLinkedNodeToMindMap(currentNode, child);
        }
      } else {
        this.addNodeToMindMap(currentNode, child);
        this.addAllChildrenToMindMap(child.getId());
      }
    }
  }

  nodeIdExists(nodeModel: NodeModel): boolean {
    const nodeId = nodeModel.getId();
    const mindMapNode = this.mindMap.getNode(nodeId);
    return mindMapNode !== null;
  }

  isDifferentParent(parentNode: Node, node: NodeModel): boolean {
    // @ts-ignore
    return !(this.tree.getNode(node.getId()).getParentId() === parentNode.id);
  }

  addLinkedNodeToMindMap(parentNode: NodeModel, node: NodeModel): void {
    const nodeId = this.linkedNodeCount.toString();
    const nodeText = '(dubbel) ' + node.getText();
    this.mindMap.addNode(parentNode, nodeId, nodeText);
    this.mindMap.getNode(nodeId).selectedType = node.getLinkedMindMapType();
    this.setNodeColor(nodeId, DuplicateColors.getDuplicateColor(this.linkedNodeCount), node.getMindMapColor());
    this.setNodeColor(node.getId(), DuplicateColors.getDuplicateColor(this.linkedNodeCount), node.getMindMapColor());
    this.linkedNodeCount++;
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
    this.mindMap.getNode(node.getId()).selectedType = node.getMindMapType();
    this.setDefaultColor(node);
  }

  setDefaultColor(node: NodeModel): void {
    this.setNodeColor(node.getId(), node.getMindMapColor(), node.getMindMapBackGroundColor());
  }

  setNodeColor(nodeId: any, backGroundColor: string, frontColor): void {
    this.mindMap.setNodeColor(nodeId, backGroundColor, frontColor);
  }

  async initialiseMindMapData(): Promise<void> {
    this.initialiseLinkedNodeCount();
    await this.initialiseTree().then(async () => {
      await this.addNodesToTreeFromApi().then(() => {
        this.mindMapData = this.tree.toMindMap();
      });
    });
  }

  initialiseLinkedNodeCount(): void {
    this.linkedNodeCount = 0;
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
      this.extractNotifications(answersData[i]);
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

  extractNotifications(data: object): void {
    // @ts-ignore
    const notificationsData = data.notifications;
    if (notificationsData === undefined) {
      return;
    }
    const notificationData = notificationsData[0];
    // @ts-ignore
    const notification = new Notification(notificationData.id, notificationData.text, data.id);
    this.tree.addNode(notification);
    this.extractQuestions(notificationData);
  }
}
