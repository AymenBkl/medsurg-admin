import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalControllersCommission } from 'src/app/classes/modalController.commission';
import { Commission } from 'src/app/interfaces/commission';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/crm/order.service';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.page.html',
  styleUrls: ['./commissions.page.scss'],
})
export class CommissionsPage implements OnInit {

  commissions: Commission[];
  currentUser: User;
  modalControllerCommission: ModalControllersCommission
  constructor(private orderService: OrderService,
              private authService: AuthService,
              private modalCntrl:ModalController) {
                this.modalControllerCommission = new ModalControllersCommission(modalCntrl);
               }

  ngOnInit() {
    this.getCommissions();
    this.getUser();
  }

  getUser(){
    this.currentUser = this.authService.user;
  }

  async getCommissions(){
    this.orderService.getCommision()
      .then((result:any) => {
        if (result && result != false){
          this.commissions = result;
          console.log(this.commissions)
        }
      })
      .catch(err => {

      })
  }

  callUpdateCommission(commission: Commission){
    this.modalControllerCommission.callUpdateCommission(this.currentUser,commission);
  }



}
