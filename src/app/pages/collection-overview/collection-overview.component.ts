import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from "sweetalert2";
import {configurationService} from "../../shared/configuration.service";

@Component({
  selector: 'app-collection-overview',
  templateUrl: './collection-overview.component.html',
  styleUrls: ['./collection-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionOverviewComponent implements OnInit {

  constructor(private conf: configurationService) { }

  ngOnInit(): void {
    let timerInterval
    Swal.fire({
      title: 'Welkom ' + this.conf.user.voornaam + '!',
      timer: 1500,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval)
      }
    })
  }
}
