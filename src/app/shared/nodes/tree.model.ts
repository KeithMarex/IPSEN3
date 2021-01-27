import {NodeModel} from './node.model';

export class Tree{
  private nodes: NodeModel[] = [];
  private readonly collectionName: string;
  private readonly collectionId: string;
  private currentNodeIndex: number;

  constructor(collectionName: string, collectionId: string) {
    this.collectionName = collectionName;
    this.collectionId = collectionId;
    this.currentNodeIndex = -1;
  }

  public getNodes(): NodeModel[] {
    return this.nodes;
  }

  public size(): number {
    return this.nodes.length;
  }

  public getCollectionName(): string {
    return this.collectionName;
  }

  public getCollectionId(): string {
    return this.collectionId;
  }

  public addNode(nodeModel: NodeModel): void {
    this.nodes.push(nodeModel);
    this.currentNodeIndex++;
  }

  public pop(): NodeModel {
    this.currentNodeIndex--;
    return this.nodes.pop();
  }

  public getCurrentNode(): NodeModel {
    return this.nodes[this.currentNodeIndex];
  }

  public getCurrentNodeIndex(): number {
    return this.currentNodeIndex;
  }

  private nodeExists(id: string): boolean {
    for (const node of this.nodes) {
      if (node.getId() === id) {
        return true;
      }
    }
    return false;
  }

  public getNode(id: string): NodeModel {
    for (const node of this.nodes) {
      if (node.getId() === id) {
        return node;
      }
    }
    return null;
  }

  public getRoot(): NodeModel {
    for (const node of this.nodes) {
      if (node.getParentId() === this.collectionId) {
        return node;
      }
    }
  }

  public getChildren(parentId: string): NodeModel[] {
    const children: NodeModel[] = [];
    for (const node of this.nodes) {
      if (node.getParentId() === parentId) {
        children.push(node);
      }
    }
    return children;
  }

  private childrenDataToMindMap(parentId: string): object {
    const children = this.getChildren(parentId);
    const childrenData: Array<object> = [];
    if (children.length === 0 && (this.nodeExists(parentId))) {
      return this.getNode(parentId).toMindMap([]);
    }
    for (const child of children) {
      childrenData.push(this.childrenDataToMindMap(child.getId()));
    }
    if (this.nodeExists(parentId)) {
      return this.getNode(parentId).toMindMap(childrenData);
    }
    return [];
  }

  private collectionChildToMindMap(): object {
    const root = this.getRoot();
    const childrenData = [];
    childrenData.push(this.childrenDataToMindMap(root.getId()));
    return root.toMindMap(childrenData);
  }

  private collectionDataToMindMap(): object {
    let childrenData;
    if (this.nodes.length === 0) {
      childrenData = [];
    } else {
      // childrenData = this.collectionChildToMindMap();
      // childrenData = [];
    }
    const collectionMindMap = {
      id: this.collectionId,
      topic: this.collectionName,
      selectedType: false,
      backgroundColor: '#7EC6E1',
      // children: childrenData};
      children: []};
    return collectionMindMap;
  }

  public toMindMap(): object {
    const data = this.collectionDataToMindMap();
    const mindMap = {
      format: 'nodeTree',
      data
    };
    return mindMap;
  }
}
