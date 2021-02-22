import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsermanagenetService } from 'src/app/services/usermanagenet.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit {
  patients: User[];
  currentUser: User;
  searchPatients : User[];
  constructor(private usermanagenetService: UsermanagenetService,
              private interactionService: InteractionService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getUser();
    this.getPatients();
  }

  getUser(){
    this.currentUser = this.authService.user;
  }


  getPatients(){
    this.interactionService.createLoading("Loading Patients")
      .then(() => {
        this.usermanagenetService.getPatients()
        .then((result: any) => {
          this.interactionService.hide();
          if (result && result != false){
            this.patients = result;
            this.searchPatients = result;
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



  onInput(value){
    const patient = value;
    this.searchProducts(patient);
  }
  
  searchProducts(medecin: string) {
    this.searchPatients= this.patients.filter(patient => 
      (patient.firstname && patient.lastname) && (patient.firstname + patient.lastname).toLowerCase().includes(medecin.toLowerCase())
    )
  }



}
