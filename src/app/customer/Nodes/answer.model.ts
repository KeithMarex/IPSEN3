import {NodeModel} from './node.model';

export class Answer extends NodeModel{

  constructor(id: string, text: string, parentId: string) {
    super(id, text, parentId);
  }
}
