import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsermanagenetService } from 'src/app/services/usermanagenet.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit {
  patients: User[];
  constructor(private usermanagenetService: UsermanagenetService,
              private interactionService: InteractionService) { }

  ngOnInit() {
    this.getPatients();
  }


  getPatients(){
    this.usermanagenetService.getPatients()
      .then((result: any) => {
        if (result && result != false){
          this.patients = result;
        }
        else {
          
        }
      })
      .catch(err => {

      })
  }

}
