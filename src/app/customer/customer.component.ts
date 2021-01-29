import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../api/api';
import { Answer } from '../shared/models/answer';
import { Notification } from '../shared/models/notification';
import { Question } from '../shared/models/question';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  collectionId : string;
  collectionName : string;
  currentQuestion : Question;
  lastAnswer : Answer;
  questionStack : Question[] = [];
  answerStack : Answer[] = [];
  showNotification : Notification;
  showEndInfo : boolean = false;

  constructor(private route: ActivatedRoute, private router : Router) {}

  async ngOnInit(): Promise<void> {
    this.setCollectionName();

    await Question.getQuestionByCollectionID(this.collectionId).then(response =>
      {
        this.currentQuestion = response;
      });
  }

  setCollectionName()
  {
    this.collectionId = this.route.snapshot.paramMap.get('collectionId');
    console.log(this.collectionId);
    const api = Api.getApi();
    api.get('/collection/' + this.collectionId).then(response => {
      if(response.data.result)
      {
        this.collectionName = response.data.result.name;
      }
    });
  }

  async onAnswered(answer : Answer)
  {
    console.log(answer);
    await Question.getQuestionByByAnswerID(answer.id).then(async question => {
      console.log("question:"); 
      console.log(question);

      this.questionStack.push(this.currentQuestion); // we pushen de huidige vraag op de stack, zodat het mogelijk is om terug te gaan.
      this.answerStack.push(answer);// ook pushen we het antwoord op de stack voor preselection in het geval van terugkeren

      if(question.id == undefined) // Geen vervolg vraag, controleren notificatie
      {
        await Notification.getNotificationByAnswerID(answer.id).then(notification => {
          console.log(notification);
          this.showNotification = notification;
          this.currentQuestion.name = "";
          //Check maken of het eindnotificatie is
          this.showEndInfo = true;
        });
        return;
      }
      
      this.currentQuestion = question;
    });
  }

  onGoBack()
  {
    this.showEndInfo = false;
    if (this.questionStack.length > 0)
    {
      // er bestaat een vorige vraag.
      this.showNotification = null;
      this.currentQuestion = this.questionStack[this.questionStack.length -1];
      this.lastAnswer = this.answerStack[this.answerStack.length - 1];
      this.questionStack.pop();
      this.answerStack.pop();
    }
    else
    {
      // er is geen vorige vraag. Keer terug naar homepage
      this.router.navigateByUrl("/");
    }
  }

}
