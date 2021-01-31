import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalControllers } from 'src/app/classes/modalControllers';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from '../../../services/crm/product.service';
import { CategoryService } from '../../../services/crm/category.service';
import { MainProduct } from 'src/app/interfaces/mainProduct';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  @Input('category') category: Category;

  @Input('type') type: string;

  @Input('selectedProducts') selectedProducts: MainProduct[];
  products: MainProduct[];
  modalController: ModalControllers;
  sliderConfig = {
    slidesPerView: 2.2,
    spaceBetween: 0
  };
  loading : boolean = false;

  constructor(private productService: ProductService,
              private modalCntrl: ModalController,
              private categoryService: CategoryService) {
                this.modalController = new ModalControllers(modalCntrl);
               }

  ngOnInit() {
    /**if (this.type === 'home'){
      this.getAllProducts();
    }
    else {
      this.getProducts();
    }**/
    if (this.type == 'add-product'){
      console.log(this.selectedProducts);
    }
    else if (this.type == 'category'){
      this.getCategoryApi();
    }
  }

  /**getProducts() {
        console.log(this.category._id);
        this.productService.getallProducts(this.category._id)
        .then((result: any) => {
          if (result && result !== false){
            this.products = result;
          }
        })
        .catch(err => {
        });
  }**/

  /**getAllProducts(){
    console.log("here");
    this.productService.getAllProducts()
      .then((result: any) => {
        if (result && result !== false){
          console.log(result);
          this.products = result;
        }
      })
      .catch(err => {
      });
  }**/
  openEditProduct(selectedProduct: MainProduct,type:string){
    if (this.type != 'add-product'){
      this.modalController.callEditProduct(selectedProduct,type,this.category._id);
    }
  }

  getCategoryApi() {
        this.loading = true;
        this.categoryService.getCategory(this.category._id)
          .then((result: any) => {
            this.loading = false;
            if (result && result != false){
              this.products = result.products;
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          })
  }

}
