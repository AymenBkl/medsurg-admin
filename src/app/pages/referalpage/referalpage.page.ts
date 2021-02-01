import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalControllersReferal } from 'src/app/classes/modalController.referal';
import { Commission } from 'src/app/interfaces/commission';
import { Referal } from 'src/app/interfaces/referal';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { ReferalService } from 'src/app/services/crm/referal.service';

@Component({
  selector: 'app-referalpage',
  templateUrl: './referalpage.page.html',
  styleUrls: ['./referalpage.page.scss'],
})
export class ReferalpagePage implements OnInit {

  currentUser: User;
  referals: Referal[];
  noRef: boolean;
  referalModalController: ModalControllersReferal;
  comission : Commission;
  totalPrice:{PAID: number,NPAID:number} = {PAID:0,NPAID:0};
  constructor(private referalService: ReferalService,
              private authService: AuthService,
              private orderService: OrderService,
              private modalCntrl: ModalController) { 
                this.referalModalController = new ModalControllersReferal(modalCntrl);
              }

  ngOnInit() {
    this.getReferalCommission();
    this.getUser();
  }

  getReferal(){
    this.referalService.getReferal()
      .then((result: any) => {
        console.log(result,this.noRef);
          if (result != false){
            this.noRef = false;
            this.referals = result;
          }
          else {
            this.noRef = true;
          }
          console.log(this.noRef);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getUser() {
    this.currentUser = this.authService.user;
    this.getReferal();
  }

    countTotalPrice(referal: Referal) {
      let totalPrice:{PAID: number,NPAID:number} = {PAID:0,NPAID:0};
      if (referal){
        referal.orders.map(order => {
          if (order.status == 'delivered'){
            if (order.referal.payedByAdmin == 'PAID'){
              if (order.refund.refund){
                totalPrice.PAID += (order.totalPrice - order.refund.refund.refundPrice ) - ((order.totalPrice - order.refund.refund.refundPrice )*order.referal.commissionApplied)/100;
              }
              else {
                totalPrice.PAID += order.totalPrice - (order.totalPrice*order.referal.commissionApplied)/100;
              }
            }
            else {
              if (order.refund.refund != null){
                totalPrice.NPAID += (order.totalPrice - order.refund.refund.refundPrice ) - ((order.totalPrice - order.refund.refund.refundPrice )*this.comission.commission)/100;
              }
              else {
                totalPrice.NPAID += order.totalPrice - (order.totalPrice*this.comission.commission)/100;
              }
            }
            
          }
        })
      }
      return totalPrice
    }
  

  referalDetail(referal: Referal){
    this.referalModalController.callReferal(this.currentUser,referal,this.comission);
  }

  getReferalCommission(){
    this.orderService.getCommision()
      .then((result:Commission[]) => {
        this.comission = result.filter(commission => {return commission.name == 'Referal'})[0];
      })
  }

  ionViewDidEnter(){
    this.getReferalCommission();
    this.getUser();

  }

  


}
