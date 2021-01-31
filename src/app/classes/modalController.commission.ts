import {  ModalController } from '@ionic/angular';
import { ComissionDetailComponent } from '../components/comission-detail/comission-detail.component';
import { GetReferalDetailComponent } from '../components/crm/referals/get-referal-detail/get-referal-detail.component';
import { Commission } from '../interfaces/commission';
import { Referal } from '../interfaces/referal';
import { User } from '../interfaces/user';

export class ModalControllersCommission {

    constructor(private modalController: ModalController){

    }

    public async callUpdateCommission(userr: User,commission: Commission){
        const modal = await this.modalController.create({
            component : ComissionDetailComponent,
            componentProps : {
                user: userr,
                commission: commission
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}
