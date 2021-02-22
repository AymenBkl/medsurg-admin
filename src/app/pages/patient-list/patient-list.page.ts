import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsermanagenetService } from 'src/app/services/usermanagenet.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit {

  constructor(private usermanagenetService: UsermanagenetService,
              private interactionService: InteractionService) { }

  ngOnInit() {
  }


  getPatients(){
    this.usermanagenetService.getPatients()
      .then((result) => {

      })
      .catch(err => {
        
      })
  }

}
