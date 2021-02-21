import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { Commission } from 'src/app/interfaces/commission';
import { Order } from 'src/app/interfaces/order';
import { PaymentStatus } from 'src/app/interfaces/paymentStatus';
import { Referal } from 'src/app/interfaces/referal';
import { User } from 'src/app/interfaces/user';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { ReferalService } from 'src/app/services/crm/referal.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-get-referal-detail',
  templateUrl: './get-referal-detail.component.html',
  styleUrls: ['./get-referal-detail.component.scss'],
})
export class GetReferalDetailComponent implements OnInit {

  referal: Referal;
  totalPrice:{PAID: number,NPAID:number} = {PAID:0,NPAID:0}
  allOrder: {
    PAID: {
      PENDING: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      SUCCESS: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      FAILED: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      ALL: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      ACTIVE: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] }
    },
    'NOT PAIED': {
      PENDING: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      SUCCESS: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      FAILED: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      ALL: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
      ACTIVE: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] }
    }
  } =
    {
      PAID: {
        PENDING: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        SUCCESS: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        FAILED: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ALL: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ACTIVE: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] }
      },
      'NOT PAIED': {
        PENDING: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        SUCCESS: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        FAILED: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ALL: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ACTIVE: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] }
      }
    }
  currentSegmentType: string = 'all';
  currentSegmentTypePayment: string = 'ALL';
  currentSegmentTypePAID: string = 'PAID';
  currentUser: User;
  modalControllerOrder: ModalControllersOrders; 
  updatePage: boolean = false;
  submited: boolean = false;
  commission: Commission;
  paymentStatus: { created: PaymentStatus[], accepted: PaymentStatus[], canceled: PaymentStatus[], rejected: PaymentStatus[], delivered: PaymentStatus[], all: PaymentStatus[] } = { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] };
  constructor(private navParams: NavParams,
              private modalCntrl: ModalController,
              private referalService: ReferalService,
              private interactionService: InteractionService,
              private cashfree: CashfreeService) {
                this.modalControllerOrder = new ModalControllersOrders(modalCntrl);
               }

  ngOnInit() {
  }


  getData(){
    this.currentUser = this.navParams.get('user');
    this.referal = this.navParams.get('referal');
    this.filterOrders(this.referal.orders);
    this.commission = this.navParams.get('commission');
    this.countTotalPrice(this.referal);

  }

  ionViewDidEnter(){
    this.getData();
  }

  goToOrderDetail(order: Order) {
    this.modalControllerOrder.callEditOrder(this.currentUser,order)
  }

  countTotalPrice(referal: Referal) {
    if (referal){
      referal.orders.map(order => {
        if (order.status == 'delivered'){
          if (order.referal.payedByAdmin == 'PAID'){
            if (order.refund.refund){
              order.totalPrice -= order.refund.refund.refundPrice;
              this.totalPrice.PAID += order.totalPrice - (order.totalPrice*order.referal.commissionApplied)/100;
            }
            else {
              this.totalPrice.PAID += order.totalPrice - (order.totalPrice*order.referal.commissionApplied)/100;
            }
          }
          else {
            console.log(referal);
            if (order.refund.refund != null){
              order.totalPrice -= order.refund.refund.refundPrice;
            }
            this.totalPrice.NPAID += order.totalPrice - (order.totalPrice*this.commission.commission)/100;
          }
          
        }
      })
    }
  }

  async filterOrders(orders: Order[]) {
    this.allOrder =
    {
      PAID: {
        PENDING: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        SUCCESS: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        FAILED: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ALL: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ACTIVE: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] }
      },
      'NOT PAIED': {
        PENDING: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        SUCCESS: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        FAILED: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ALL: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
        ACTIVE: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] }
      }
    }
    for(let order of orders){
      let r = await this.cashfree.paymentStatus(order._id)
        .then(async (paymentStatus: PaymentStatus) => {
          if (order.method == 'card' && paymentStatus.status == 'OK') {
            let result = await this.affectCard(order, paymentStatus);
          }
          else if (order.method == 'cod' && paymentStatus.status == 'ERROR'){
            this.allOrder.PAID.ALL.all.push(order);
            this.allOrder.PAID.SUCCESS[order.status].push(order);
            this.allOrder.PAID.SUCCESS.all.push(order);
          }
        })
      console.log(this.allOrder);
    };
  }

  async affectCard(order: Order,paymentStatus) {
    order.paymentStatus = paymentStatus;
    this.allOrder[order.payedByAdmin].ALL.all.push(order);
    this.allOrder[order.payedByAdmin].ALL[order.status].push(order);
    if (order.paymentStatus && order.paymentStatus.txStatus) {
      this.allOrder[order.payedByAdmin][order.paymentStatus.txStatus].all.push(order)
      this.allOrder[order.payedByAdmin][order.paymentStatus.txStatus][order.status].push(order);
    }
    else if (order.paymentStatus && !order.paymentStatus.txStatus) {
      this.allOrder[order.payedByAdmin][order.paymentStatus.orderStatus].all.push(order)
      this.allOrder[order.payedByAdmin][order.paymentStatus.orderStatus][order.status].push(order);
    }
  }
  segmentChanged(event) {
    this.currentSegmentType = event.detail.value;
  }

  segmentChangedPayment(event) {
    this.currentSegmentTypePayment = event.detail.value;
  }

  segmentChangedPAID(event) {
    this.currentSegmentTypePAID = event.detail.value;
  }




  back(){
    this.updatePage = false;
  }

  

}
