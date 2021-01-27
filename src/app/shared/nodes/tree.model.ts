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

  private collectionDataToMindMap(): object {
    const collectionMindMap = {
      id: this.collectionId,
      topic: this.collectionName,
      selectedType: false,
      backgroundColor: '#7EC6E1',
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
