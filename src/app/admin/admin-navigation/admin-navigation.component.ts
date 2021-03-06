import {Component, OnInit, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import Swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserModel} from '../../shared/models/user.model';
import {Api} from '../../api/api';
import {NotificationModel} from "../../shared/models/notification.model";
import {Cookie} from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {
  @Output() createCategor = new EventEmitter();
  @Output() changeCategor = new EventEmitter();
  @Output() deleteCategor = new EventEmitter();
  public notifications: NotificationModel[] = [];
  @ViewChild('notificationTab') nt;
  @Input() selectedCollectionId: number;
  currData: string;

  Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  constructor(private http: HttpClient, private route: Router) {
  }

  ngOnInit(): void {
  }

  editAccount(): void {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Volgende &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'Voer je oude wachtwoord in',
      },
      'Voer je nieuwe wachtwoord in',
      'Herhaal je nieuwe wachtwoord'
    ]).then((result) => {
      // @ts-ignore
      if (result.value) {
        // @ts-ignore
        const answers = JSON.parse(JSON.stringify(result.value));
        const user = UserModel.getLoggedInUser();
        // TODO add confirm previous password
        if (answers[1] === answers[2]) {
          const postData = {
            id: user.id,
            password: answers[2],
          };

          const api = Api.getApi();
          api.post('/user/update', postData).then((response) => {
            Swal.fire({
              icon: 'success',
              title: 'Nieuw wachtwoord ingesteld!',
              confirmButtonText: 'Oke'
            });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Nieuwe wachtwoorden komen niet overeen',
            text: 'Je nieuwe wachtwoord is niet opgeslagen.',
            confirmButtonText: 'Oke'
          });
        }
      }
    });
  }

  createUser(): void {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Volgende &rarr;',
      cancelButtonText: '&larr; Vorige',
      showCancelButton: true,
      reverseButtons: true,
      progressSteps: ['1', '2', '3', '4', '5']
    }).queue([
      {
        title: 'Nieuwe gebruiker',
        text: 'Geef een email-adres op'
      },
      {
        title: 'Geef een wachtwoord op',
      },
      {
        title: 'Geef de voornaam van de gebruiker',
      },
      {
        title: 'Geef de achternaam van de gebruiker',
      },
      {
        title: 'Geef de usergroup op',
        text: 'super_admin of admin',
      },
    ]).then((result) => {
      // @ts-ignore
      if (result.value) {
        // @ts-ignore
        const answers = JSON.parse(JSON.stringify(result.value));
        // TODO Check of er al een gebruiker bestaat met het opgegeven email adres -> Check wordt gedaan in API
        const postData = {
          email: answers[0],
          first_name: answers[2],
          last_name: answers[3],
          password: answers[1],
          permission_group: answers[4]
        };
        const api = Api.getApi();
        api.post('/user/create', postData).then((response) => {
          if (response.data.result === true) {
            Swal.fire({
              icon: 'success',
              title: 'Gebruiker ' + answers[2] + ' aangemaakt!',
              confirmButtonText: 'Oke'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Nieuwe gebruiker niet aangemaakt',
              text: 'Het opgegeven email adres is al in gebruik.',
              confirmButtonText: 'Oke'
            });
          }
        });
      }
    });
  }

  logOut(): void {
    Cookie.delete('user_token', '/');
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Succesvol uitgelogd',
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.route.navigate(['/']);
    });
  }

  createCategory() {
    this.createCategor.emit();
  }

  changeCategory() {
    this.changeCategor.emit();
  }

  deleteCategory() {
    this.deleteCategor.emit();
  }

  openNotification(): void {
    this.notifications = [];
    Api.getApi().get('/notification/get/all').then(res => {
      const data = res['data']['result'];
      data.forEach(val => {
        this.notifications.push(new NotificationModel(val.id, val.text));
      });
    });
    this.nt.fire();
  }

  makeNotification(html: string): void {
    Api.getApi().post('/notification/create', {text: html}).then(result => {
      this.Toast.fire({
        icon: 'success',
        title: 'Notificatie is aangemaakt!'
      });
    });
  }
}
