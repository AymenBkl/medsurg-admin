import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { AllproductsService } from '../../services/crm/allproducts.service';
import { NavController, ModalController, Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ModalControllers } from '../../classes/modalControllers';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { MainProduct } from 'src/app/interfaces/mainProduct';


@Component({
  selector: 'app-main-products',
  templateUrl: './main-products.page.html',
  styleUrls: ['./main-products.page.scss'],
})
export class MainProductsPage implements OnInit {

  currentUser: User;
  mainProducts: MainProduct[] = [];
  modalController: ModalControllers;
  searchProduct: MainProduct[];
  arrToDisplay: any;
  @ViewChild('files') files:ElementRef;
  constructor(private authService: AuthService,
              private intercationService: InteractionService,
              private allProductService: AllproductsService,
              private navCntrl: NavController,
              private modalCntrl: ModalController,
              private router: Router,
              private platform: Platform,
              private interactionService: InteractionService
              ) {
                this.modalController = new ModalControllers(modalCntrl);
              }

  ngOnInit() {
    this.checkmainProducts();
}
getMainProducts() {
  this.intercationService.createLoading('Loading Please Wait !')
    .then(() => {
      this.allProductService.getAllMainProducts()
      .then((result: any) => {
        console.log(result)
        this.intercationService.hide();
        if (result && result !== false){
          this.mainProducts = result;
          this.searchProduct = result;
          this.watchResolution(false);
        }
        else {
          this.mainProducts = [];
          this.intercationService.createToast('Error NOT FOUND', 'danger', 'bottom');
        }
      })
      .catch(err => {
        console.log(err);
        this.mainProducts = [];
        this.intercationService.hide();
        this.intercationService.createToast('Error', 'danger', 'bottom');
      });
    });
}

goToEditProduct(selectedProduct: MainProduct) {
  this.router.navigate(['/addproduct', {type:'edit-product',mainproduct: JSON.stringify(selectedProduct)}]);
}

ionViewDidEnter(){
  this.currentUser = this.authService.user;
}

checkmainProducts(){
  this.getMainProducts();
}

ionViewDidLeave(){
}


onInput(value){
  const medecin = value;
  this.searchProducts(medecin);
}

searchProducts(medecin: string) {
  this.searchProduct = this.mainProducts.filter(product => 
    product.name && product.name.toLowerCase().includes(medecin.toLowerCase())
  )
  this.watchResolution(true);
}

watchResolution(search:boolean){
  this.platform.ready()
    .then(() => {
      if (!search){
        this.platform.resize
        .subscribe(resize => {
          this.initProducts(this.platform.width());
        })
      }
       this.initProducts(this.platform.width());
    })
}

calculateNumberOfColumns(width: number){
  let numberColumns = 0;
  if (width < 767){
    numberColumns = 2;
  }
  else if (width >= 767 && width < 991){
    numberColumns = 3;
  }
  else {
    numberColumns = 4;
  }

  return numberColumns;
}

initProducts(width: number){
  let numberOfColumns = this.calculateNumberOfColumns(width);
  this.arrToDisplay = []; 
  for(var i=0;i < this.searchProduct.length;i = i+numberOfColumns)
  this.arrToDisplay.push(this.searchProduct.slice(i,i+numberOfColumns));

}

openFile(){
  this.files.nativeElement.click();
}

selectedFile(event) {

  this.interactionService.createLoading('Uploading Your Excel File !!')
    .then(() => {
      const formData = new FormData();
      console.log(this.isFileImage(event.target.files[0]));
      formData.append('file', event.target.files[0]);

      /**this.allProductService.postFile(formData)
        .then((result: any) => {
          this.interactionService.hide();
          if (result && result !== false){
            this.interactionService.createToast('Your Products File Uploaded', 'success', 'bottom');
            this.getMainProducts();
          }
          else {
            this.interactionService.hide();
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
          }
    }   );
    **/
    }).catch(err => {
      this.interactionService.hide();
      this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
    });
}

isFileImage(file) {
  const acceptedImageTypes = ['image/jpeg', 'image/png'];

  return file && acceptedImageTypes.includes(file['type'])
}
}
