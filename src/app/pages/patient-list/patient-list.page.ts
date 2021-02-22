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
    this.interactionService.createLoading("Loading Patients")
      .then(() => {
        this.usermanagenetService.getPatients()
        .then((result: any) => {
          this.interactionService.hide();
          if (result && result != false){
            this.patients = result;
            this.interactionService.createToast('Patients has been loaded !', 'success', 'bottom');
          }
          else {
            this.interactionService.createToast('No Patients Found !', 'light', 'bottom');
          }
        })
        .catch(err => {
          this.interactionService.hide();
          this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');

        })
      })
    
  }



}
