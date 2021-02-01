import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { Commission } from 'src/app/interfaces/commission';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  currentUser: User;
  orderStatus: string = '';
  modalControllerOder: ModalControllersOrders;
  isValidRefund:boolean = true;
  commissions: Commission[];
  constructor(private navParams: NavParams,
              private modalCntrl: ModalController,
              private orderService: OrderService,
              private interactionService: InteractionService) {
                this.modalControllerOder = new ModalControllersOrders(modalCntrl);
              }

  ngOnInit() {
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
    this.getCommissions();
    if (this.order.refund && this.order.refund.refund){
      this.order.totalPrice -= this.order.refund.refund.refundPrice;
    }
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

  getProductNames() {
    var productNames : string[] = [];
    this.order.products.map(product => {
      productNames.push(product.product.mainProduct.name + '\n');
    })
    return productNames;
  }

  statusChanged(event){
    this.orderStatus = event.detail.value;
  }


 
  callRefundDetail(){
    this.modalControllerOder.callRefundDetail(this.currentUser,this.order);
  }

  ionViewDidEnter(){
    this.getData();
    this.checkOrderDate();
  }

  checkOrderDate(){
    const orderDate = (new Date(this.order.createdAt).getTime() / 1000) + 60 ;
    const finish = (new Date().getTime() / 1000) ;
    this.isValidRefund = orderDate < finish ;
  }

  callPaymentGetway(i){
    this.modalControllerOder.PaymentGetway(this.commissions[i],this.order);
  }




  

}



