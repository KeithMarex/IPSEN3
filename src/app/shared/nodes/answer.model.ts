import {NodeModel} from './node.model';

export class Answer extends NodeModel{

  constructor(id: string, text: string, parentId: string) {
    super(id, text, parentId);
    super.setMindMapColor('#E1A40D');
    super.setMindMapBackGroundColor('#f9e79f');
    super.setMindMapType('Answer');
  }
}
