import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditUserComponent } from 'src/app/components/user/edit-user/edit-user.component';
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
              private authService: AuthService,
              private modalCntrl: ModalController) { }

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

  async editPatient(patient: User){
    const modal = await this.modalCntrl.create({
      component : EditUserComponent,
      componentProps : {
          patient: patient,
      }
      
  });
  modal.onDidDismiss()
      .then(data => {
      });
  return await modal.present();
  }


  blockUnBlockUser(patient: User,status: string) {
    const msg = status != 'active' ? "Block" : 'UnBlock'
    this.interactionService.alertWithHandler("Do You want to " + msg + "Patient " + patient.firstname,'ALERT',"CANCEL",msg)
      .then((result) => {
        if (result) {
          this.interactionService.createLoading('Updating User  information')
          .then(() => {
            console.log(patient._id)
            this.usermanagenetService.updateUser(patient._id,{status:status})
              .then((result: any) => {
                this.interactionService.hide();
                if (result && result !== false){
                  this.interactionService.createToast('User Information Has Been Updated', 'success', 'bottom');
                  patient.status = status;
                }
                else {
                  this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
                }
              })
              .catch(err => {
                this.interactionService.hide();
                this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
              });
          });
        }
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
