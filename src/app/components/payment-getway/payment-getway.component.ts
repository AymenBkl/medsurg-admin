import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Commission } from 'src/app/interfaces/commission';
import { Order } from 'src/app/interfaces/order';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-payment-getway',
  templateUrl: './payment-getway.component.html',
  styleUrls: ['./payment-getway.component.scss'],
})
export class PaymentGetwayComponent implements OnInit {

  commission: Commission;
  order: Order;
  constructor(private orderService: OrderService,
              private navParams: NavParams,
              private interactionService: InteractionService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.order = this.navParams.get('order');
    this.commission = this.navParams.get('commission');
    console.log(this.order);
  }

  payPharmacy(){
    this.orderService.payPharmacy(this.order._id,this.commission.commission)
      .then((result) => {
        if (result && result != false){
          this.interactionService.createToast('Your Order Has been Updated !', 'success', 'bottom');
        }
        else {
          this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
        }
      })
      .catch(err => {
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      })
}

payReferal(){
  this.orderService.payReferal(this.order._id,this.commission.commission,this.order.referal.referal._id)
    .then((result) => {
      if (result && result != false){
        this.interactionService.createToast('Your Order Has been Updated !', 'success', 'bottom');
      }
      else {
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      }
    })
    .catch(err => {
      this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
    })
}
payPatient(){
  this.orderService.payRefund(this.order._id,this.commission.commission,this.order.referal.referal._id)
    .then((result) => {
      if (result && result != false){
        this.interactionService.createToast('Your Order Has been Updated !', 'success', 'bottom');
      }
      else {
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      }
    })
    .catch(err => {
      this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
    })
}
}
