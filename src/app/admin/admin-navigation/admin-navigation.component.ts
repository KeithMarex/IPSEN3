import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {Router} from '@angular/router';
import {UserModel} from '../../shared/models/user.model';
import {Api} from '../../api/api';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {

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
          console.log(postData);

          const api = Api.getApi();
          api.post('/user/update', postData).then((response) => {
            console.log(response);
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
        console.log(postData);
        const api = Api.getApi();
        api.post('/user/create', postData).then((response) => {
          console.log(response);
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
    Cookie.delete('token');
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
}
