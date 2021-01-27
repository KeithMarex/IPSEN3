
import {NodeModel} from './node.model';

export class Question extends NodeModel{

  constructor(id: string, text: string, parentId: string, questionType: string) {
    super(id, text, parentId);
    super.setMindMapColor('#f4d03f');
    super.setMindMapBackGroundColor('#f4d03f');
    super.setMindMapType('Question');
    this.questionType = questionType;
  }

  private static QUESTION_TYPE_DROPDOWN = 'DropDown';

  private questionType: string;

  public static getDropDownTypeString(): string {
    return this.QUESTION_TYPE_DROPDOWN;
  }

  public getQuestionType(): string {
    return this.getQuestionType();
  }
}
