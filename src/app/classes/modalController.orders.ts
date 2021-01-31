import {  ModalController } from '@ionic/angular';
import { OrderDetailComponent } from '../components/crm/orders/order-detail/order-detail.component';
import { RefundDetailComponent } from '../components/crm/orders/refund-detail/refund-detail.component';
import { PaymentGetwayComponent } from '../components/payment-getway/payment-getway.component';
import { Commission } from '../interfaces/commission';
import { Order } from '../interfaces/order';
import { User } from '../interfaces/user';

export class ModalControllersOrders {

    constructor(private modalController: ModalController){

    }

    public async callEditOrder(userr: User,ordeR: Order){
        const modal = await this.modalController.create({
            component : OrderDetailComponent,
            componentProps : {
                user: userr,
                order: ordeR
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }

    public async callRefundDetail(userr: User,ordeR: Order){
        const modal = await this.modalController.create({
            component : RefundDetailComponent,
            componentProps : {
                user: userr,
                order: ordeR
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
    public async PaymentGetway(commission:Commission,ordeR: Order){
        const modal = await this.modalController.create({
            component : PaymentGetwayComponent,
            componentProps : {
                commission: commission,
                order: ordeR
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}
