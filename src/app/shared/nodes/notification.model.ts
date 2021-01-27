import {NodeModel} from './node.model';

export class Notification extends NodeModel{

  constructor(id: string, text: string, parentId: string) {
    super(id, text, parentId);
    super.setMindMapColor('#f5b7b1');
    super.setMindMapBackGroundColor('#f192b2');
    super.setLinkedColor('#c93c6b');
    super.setMindMapType('Notification');
  }
}
