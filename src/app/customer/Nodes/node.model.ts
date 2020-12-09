
export class NodeModel {

  private previousNode: NodeModel;

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
}
