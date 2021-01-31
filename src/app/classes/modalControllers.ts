import { NavController, ModalController } from '@ionic/angular';
import { EditCategoryComponent } from '../components/modals/edit-category/edit-category.component';
import { EditProductComponent } from '../components/modals/edit-product/edit-product.component';
import { PrescriptionComponent } from '../components/posts/prescription/prescription.component';
import { Category } from '../interfaces/category';
import { MainProduct } from '../interfaces/mainProduct';
import { Prescription } from '../interfaces/prescriptions';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';


export class ModalControllers {

    constructor(private modalController: ModalController){

    }

    public async callEditCategory(selectedCategory: Category){
        const modal = await this.modalController.create({
            component : EditCategoryComponent,
            componentProps : {
                category : selectedCategory
            }
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }

    public async callEditProduct(selectedProduct: MainProduct,type:string,categoryId:string){
        const modal = await this.modalController.create({
            component : EditProductComponent,
            componentProps : {
                product : selectedProduct,
                type: type,
                categoryId:categoryId
            }
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }

    public async callPrescriptionPage(userr: User, prescriptionn: Prescription){
        const modal = await this.modalController.create({
            component : PrescriptionComponent,
            componentProps : {
                prescription : prescriptionn,
                user: userr
            }
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}
