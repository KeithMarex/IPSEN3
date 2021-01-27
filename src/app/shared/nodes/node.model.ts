
export class NodeModel {

  private previousNode: NodeModel;
  private mindMapColor = '#fff';
  private mindMapBackGroundColor = '#ccc';
  private linkedColor = '#888';
  private mindMapType = 'node';
  private linkedMindMapType = 'duplicateNode';

  constructor(private id: string, private text: string, private parentId: string) {}

  public getId(): string {
    return this.id;
  }

  public getText(): string {
    return this.text;
  }

  public getParentId(): string {
    return this.parentId;
  }

  public setPreviousNode(previousNode: NodeModel): void {
    this.previousNode = previousNode;
  }

  public getPreviousNode(): NodeModel {
    return this.previousNode;
  }

  protected setMindMapColor(mindMapColor: string): void {
    this.mindMapColor = mindMapColor;
  }

  public getMindMapColor(): string {
    return this.mindMapColor;
  }

  protected setMindMapBackGroundColor(mindMapBackGroundColor: string): void {
    this.mindMapBackGroundColor = mindMapBackGroundColor;
  }

  public getMindMapBackGroundColor(): string {
    return this.mindMapBackGroundColor;
  }

  protected setLinkedColor(linkedColor: string): void {
    this.linkedColor = linkedColor;
  }

  public getLinkedColor(): string {
    return this.linkedColor;
  }

  public getLinkedMindMapType(): string {
    return this.linkedMindMapType;
  }

  protected setMindMapType(mindMapType: string): void {
    this.mindMapType = mindMapType;
  }

  public getMindMapType(): string {
    return this.mindMapType;
  }
}
