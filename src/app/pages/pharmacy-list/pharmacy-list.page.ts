import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditUserComponent } from 'src/app/components/user/edit-user/edit-user.component';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsermanagenetService } from 'src/app/services/usermanagenet.service';

@Component({
  selector: 'app-pharmacy-list',
  templateUrl: './pharmacy-list.page.html',
  styleUrls: ['./pharmacy-list.page.scss'],
})
export class PharmacyListPage implements OnInit {

  pharmacies: User[];
  currentUser: User;
  searchPharmacies : User[];
  constructor(private usermanagenetService: UsermanagenetService,
              private interactionService: InteractionService,
              private authService: AuthService,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.getUser();
    this.getPharmacies();
  }

  getUser(){
    this.currentUser = this.authService.user;
  }


  getPharmacies(){
    this.interactionService.createLoading("Loading Pharmacies")
      .then(() => {
        this.usermanagenetService.getUsers()
        .then((result: any) => {
          this.interactionService.hide();
          if (result && result != false){
            this.pharmacies = result;
            this.searchPharmacies = result;
            this.interactionService.createToast('Pharmacies has been loaded !', 'success', 'bottom');
          }
          else {
            this.interactionService.createToast('No Pharmacies Found !', 'light', 'bottom');
          }
        })
        .catch(err => {
          this.interactionService.hide();
          this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');

        })
      })
    
  }

  async editPharmacy(pharmacy: User){
    const modal = await this.modalCntrl.create({
      component : EditUserComponent,
      componentProps : {
          user: pharmacy,
      }
      
  });
  modal.onDidDismiss()
      .then(data => {
      });
  return await modal.present();
  }


  blockUnBlockUser(pharmacy: User,status: string) {
    const msg = status != 'active' ? "Block" : 'UnBlock'
    this.interactionService.alertWithHandler("Do You want to " + msg + "pharmacy " + pharmacy.firstname,'ALERT',"CANCEL",msg)
      .then((result) => {
        if (result) {
          this.interactionService.createLoading('Updating User  information')
          .then(() => {
            console.log(pharmacy._id)
            this.usermanagenetService.updateUser(pharmacy._id,{status:status})
              .then((result: any) => {
                this.interactionService.hide();
                if (result && result !== false){
                  this.interactionService.createToast('User Information Has Been Updated', 'success', 'bottom');
                  pharmacy.status = status;
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

  goTo(id: string){
    window.open('/user-orders/pharmacy/'+ id, "_blank");
  }



  onInput(value){
    const pharmacy = value;
    this.searchProducts(pharmacy);
  }
  
  searchProducts(medecin: string) {
    this.searchPharmacies = this.pharmacies.filter(pharmacy => 
      (pharmacy.firstname && pharmacy.lastname) && (pharmacy.firstname + pharmacy.lastname).toLowerCase().includes(medecin.toLowerCase())
    )
  }

}
