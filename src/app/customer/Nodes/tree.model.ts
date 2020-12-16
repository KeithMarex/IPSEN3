import {NodeModel} from './node.model';
import {Answer} from './answer.model';

export class Tree{
  private nodes: NodeModel[] = [];
  private readonly collectionName: string;
  private currentNodeIndex: number;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.currentNodeIndex = -1;
  }

  public getCollectionName(): string {
    return this.collectionName;
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
}
