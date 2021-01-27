import {NodeModel} from './node.model';

export class Answer extends NodeModel{

  constructor(id: string, text: string, parentId: string) {
    super(id, text, parentId);
    super.setMindMapColor('#f9e79f');
    super.setMindMapBackGroundColor('#f9e79f');
    super.setLinkedColor('#e3bb1e');
    super.setMindMapType('Answer');
  }
}
