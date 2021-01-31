import {  ModalController } from '@ionic/angular';
import { GetReferalDetailComponent } from '../components/crm/referals/get-referal-detail/get-referal-detail.component';
import { Commission } from '../interfaces/commission';
import { Referal } from '../interfaces/referal';
import { User } from '../interfaces/user';

export class ModalControllersReferal {

    constructor(private modalController: ModalController){

    }

    public async callReferal(userr: User,ref: Referal,commission: Commission){
        const modal = await this.modalController.create({
            component : GetReferalDetailComponent,
            componentProps : {
                user: userr,
                referal: ref,
                commission: commission
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}
