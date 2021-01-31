import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { User } from 'src/app/interfaces/user';
import { AllproductsService } from 'src/app/services/crm/allproducts.service';
import { CategoryService } from 'src/app/services/crm/category.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-add-product-to-category',
  templateUrl: './add-product-to-category.component.html',
  styleUrls: ['./add-product-to-category.component.scss'],
})
export class AddProductToCategoryComponent implements OnInit {

  @Input('user') currentUser: User;
  @Input('category') category: Category;
  mainProducts: MainProduct[];
  searchProduct: MainProduct[];
  arrToDisplay: any;
  selectedProducts: MainProduct[] = [];
  constructor(private intercationService: InteractionService,
              private allProductService: AllproductsService,
              public platform: Platform,
              private categoryService: CategoryService,
              private navCntrl: NavController) { }

  ngOnInit() {
    this.getMainProducts()
  }


  getMainProducts() {
    this.intercationService.createLoading('Loading Please Wait !')
      .then(() => {
        this.allProductService.getMainProducts()
        .then((result: any)=> {
          this.mainProducts = result;
          this.searchProduct = result;
          this.watchResolution(false);
          this.intercationService.hide();
          console.log(result);
        });
      });
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

  selectedProduct(mainProduct: MainProduct){
    const isIn = this.selectedProducts.indexOf(mainProduct);
    if (isIn === -1){
      this.selectedProducts.push(mainProduct);
    }
    else {
      this.selectedProducts.splice(isIn,1);
    }
  }

  addProductToCategory(){
    if (this.selectedProducts.length > 0){
      this.intercationService.createLoading("Adding your products")
        .then(() => {
          this.categoryService.appendProducts(this.category,this.selectedProducts)
            .then((result: any) => {
              this.intercationService.hide();
              if (result && result !== false){
                this.intercationService.createToast('You products has been Added','success','bottom');
                this.navCntrl.back(); 
              }
              else {
                this.intercationService.createToast('Something Went Wrong !','danger','bottom');
              }
            })
            .catch(err => {
              this.intercationService.hide();
              this.intercationService.createToast('Something Went Wrong !','danger','bottom');
            })
        })
    }
  }

}
