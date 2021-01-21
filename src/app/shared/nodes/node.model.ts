
export class NodeModel {

  private previousNode: NodeModel;
  private mindMapColor = '#fff';
  private mindMapType = 'node';

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

  private getMindMapColor(): string {
    return this.mindMapColor;
  }

  protected setMindMapType(mindMapType: string): void {
    this.mindMapType = mindMapType;
  }

  private getMindMapType(): string {
    return this.mindMapType;
  }

  public toMindMap(childrenData: Array<object>): object {
    const data = {
      id: this.id,
      color: this.getMindMapColor(),
      topic: this.getText(),
      direction: 'right',
      selectedType: 'this.getType',
      backgroundColor: '#616161',
      children: [childrenData]
    };
    return data;
  }
}
