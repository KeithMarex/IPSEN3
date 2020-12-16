
import {NodeModel} from './node.model';

export class Question extends NodeModel{

  private questionType: string;

  constructor(id: string, text: string, parentId: string, questionType: string) {
    super(id, text, parentId);
    this.questionType = questionType;
  }

  public getQuestionType(): string {
    return this.getQuestionType();
  }


}
