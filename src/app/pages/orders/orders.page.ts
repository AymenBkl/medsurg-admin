import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { PaymentStatus } from 'src/app/interfaces/paymentStatus';
import { CashfreeService } from 'src/app/services/cashfree.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  currentUser: User;
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

  modalControllerOrder: ModalControllersOrders;
  paymentStatus: { created: PaymentStatus[], accepted: PaymentStatus[], canceled: PaymentStatus[], rejected: PaymentStatus[], delivered: PaymentStatus[], all: PaymentStatus[] } = { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] };
  constructor(private ordersService: OrderService,
    private authService: AuthService,
    private interactionService: InteractionService,
    private modalCntrl: ModalController,
    private cashfree: CashfreeService) {
    this.modalControllerOrder = new ModalControllersOrders(this.modalCntrl);
  }

  ngOnInit() {
  }


  getAllOrders() {
    this.interactionService.createLoading("Loading Your Message !! ..")
      .then(() => {
        this.ordersService.getOrders()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              if (result.length != 0) {
                this.interactionService.createToast('Your Orders has been loaded !', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('You dont have any orders !', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('No Orders Found !', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      })
  }

  subscribetoOrders() {
    this.ordersService.getOrderSubject()
      .subscribe(orders => {
        this.filterOrders(orders);
      })
  }

  goToOrderDetail(order: Order) {
    this.modalControllerOrder.callEditOrder(this.currentUser, order)
  }

  filterOrders(orders: Order[]) {
    orders.map(async (order) => {
      order.method == 'card' ? await this.checkPaymentStatus(order) : '';
      this.allOrder[order.payedByAdmin].ALL.all.push(order);
      this.allOrder[order.payedByAdmin].ALL[order.status].push(order);
      console.log(this.allOrder)
    });
  }

  async checkPaymentStatus(order: Order) {
    if (order.method == 'card') {
      await this.cashfree.paymentStatus(order._id)
        .then(async (paymentStatus: PaymentStatus) => {
          order.paymentStatus = paymentStatus;
          if (order.paymentStatus && order.paymentStatus.txStatus) {
            this.allOrder[order.payedByAdmin][order.paymentStatus.txStatus].all.push(order)
            this.allOrder[order.payedByAdmin][order.paymentStatus.txStatus][order.status].push(order);
          }
          else if (order.paymentStatus && !order.paymentStatus.txStatus) {
            this.allOrder[order.payedByAdmin][order.paymentStatus.orderStatus].all.push(order)
            this.allOrder[order.payedByAdmin][order.paymentStatus.orderStatus][order.status].push(order);
          }
        })
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

  ionViewDidEnter(){
    this.currentUser = this.authService.user;
    this.subscribetoOrders();
    this.getAllOrders();
  }


}