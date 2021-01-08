import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CollectionModel} from '../../../shared/models/collection.model';
import {Api} from '../../../api/api';
import {AnswerModel} from "../../../shared/models/answer.model";

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {

  selectedCollection: CollectionModel = null;
  answers: AnswerModel[] = [];
  firstQuestion: string;
  isDataAvailable = false;

  routes = ['Collections'];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const response = await Api.getApi().get('/collection/' + this.route.snapshot.paramMap.get('id'));
      const firstQuestion = await Api.getApi().get('/question/getByCollection/' + this.route.snapshot.paramMap.get('id'));
      const answers = await Api.getApi().get('/answer/getByQuestion/' + firstQuestion.data.result.id);
      this.firstQuestion = firstQuestion.data.result.name;
      const r = response.data.result;
      this.selectedCollection = new CollectionModel(r.id, r.name, r.type, r.version);
      this.routes.push(this.selectedCollection.name);
      for (let i = 0; i < answers.data.result.length; i++){
        this.answers.push(new AnswerModel(answers.data.result[i].id, answers.data.result[i].name));
      }
      this.isDataAvailable = true;
    });
  }

}
