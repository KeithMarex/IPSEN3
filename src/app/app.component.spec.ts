import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {DuplicateColors} from './shared/nodes/duplicate-colors.model';
import { RouterTestingModule } from '@angular/router/testing';
import {Answer} from './shared/nodes/answer.model';
import {Tree} from "./shared/nodes/tree.model";
import {NodeModel} from "./shared/nodes/node.model";
import {Question} from "./shared/nodes/question.model";


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        DuplicateColors
      ],
    }).compileComponents();
  });

  it('DuplicateColors.getDuplicateColor(8) should return the color dark red', () => {
    const color = DuplicateColors.getDuplicateColor(8);
    expect(color).toEqual('#990033');
  });

  it('DuplicateColors.getDuplicateColor(12) should return the color light blue', () => {
    const color = DuplicateColors.getDuplicateColor(12);
    expect(color).toEqual('#00ccff');
  });

  it('new Answer(\'1\', \'AnswerText\', \'0\') should not be null', () => {
    const answer = new Answer('1', 'AnswerText', '0');
    expect(answer).not.toEqual(null);
  });

  it('new Answer(\'1\', \'AnswerText\', \'0\') should have the id \'1\'', () => {
    const answer = new Answer('1', 'AnswerText', '0');
    expect(answer.getId()).toEqual('1');
  });

  it('new Answer(\'1\', \'AnswerText\', \'0\') should have the parentId \'0\'', () => {
    const answer = new Answer('1', 'AnswerText', '0');
    expect(answer.getParentId()).toEqual('0');
  });

  it('new Answer(\'1\', \'AnswerText\', \'0\') should have the text \'AnswerText\'', () => {
    const answer = new Answer('1', 'AnswerText', '0');
    expect(answer.getText()).toEqual('AnswerText');
  });

  it('The added nodes should be correct added to the tree', () =>{
    const question = new Question('1', 'Will this test be a succes', '0', 'DropDown');
    const answerYes = new Answer('2', 'Yes', '1');
    const answerNo = new Answer('3', 'No', '1');
    const tree = new Tree('TestTree', '0');
    tree.addNode(question);
    tree.addNode(answerYes);
    tree.addNode(answerNo);
    const nodes = tree.getNodes();

    const expectedNodes: NodeModel[] = [];
    expectedNodes.push(question);
    expectedNodes.push(answerYes);
    expectedNodes.push(answerNo);

    expect(nodes).toEqual(expectedNodes);
  });

  it('The getSize() function in tree should return the correct size', () => {
    const question = new Question('1', 'Will this test be a succes', '0', 'DropDown');
    const answerYes = new Answer('2', 'Yes', '1');
    const answerNo = new Answer('3', 'No', '1');
    const tree = new Tree('TestTree', '0');
    tree.addNode(question);
    tree.addNode(answerYes);
    tree.addNode(answerNo);

    expect(tree.size()).toEqual(3);
  });

  it('The getCollectionName() function in tree should return the correct collectionName', () => {
    const collectionName = 'TestTree';
    const collectionId = '0';
    const tree = new Tree(collectionName, '0');
    expect(tree.getCollectionName()).toEqual(collectionName);
  });

  it('The getCollectionId() function in tree should return the correct collectionId', () => {
    const collectionName = 'TestTree';
    const collectionId = '0';
    const tree = new Tree(collectionName, '0');
    expect(tree.getCollectionId()).toEqual(collectionId);
  });

  it('The toMindMap() function of a tree should return a correct object', () => {
    const collectionName = 'TestCollection';
    const collectionId = '0';
    const tree = new Tree(collectionName, collectionId);
    const mindMapData = tree.toMindMap();
    const expectedData = {
      format: 'nodeTree',
      data: {
        id: collectionId,
        topic: collectionName,
        selectedType: false,
        backgroundColor: '#7EC6E1',
        children: []}
    };
    expect(mindMapData).toEqual(expectedData);
  });
});
