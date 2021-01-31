import { Injectable } from '@angular/core';
import { ProductResponse } from 'src/app/interfaces/ProductResponse';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ProccessHttpErrosService } from '../proccess-http-erros.service';
import { AuthService } from '../auth.service';
import { Subject } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from '../../services/crm/category.service';
import { MainProduct } from 'src/app/interfaces/mainProduct';
@Injectable({
  providedIn: 'root'
})
export class ProductService {


  productUrl = config.baseURL + 'account/admin/';
  products: Subject<MainProduct[]> = new Subject<MainProduct[]>();
  allProducts: MainProduct[];
  categoryIds: {category: string}[];
  constructor(private httpClient: HttpClient,
              private proccessHttpErrorService: ProccessHttpErrosService,
              private authService: AuthService,
              private categoryService: CategoryService) {
              }

  updateProduct(product, productId) {
    return new Promise((resolve, reject) => {
      this.httpClient.put<ProductResponse>(this.productUrl + 'updatemainproduct/' + productId , product)
        .subscribe(response => {
          if (response.status === 200) {
            console.log(response);
            resolve(response.product);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }
  postImage(formData: FormData, productId) {

    return new Promise((resolve, reject) => {
    this.httpClient.post<ProductResponse>(config.baseURL  + 'crm/productsfiles/addimage/' + productId, formData)
      .subscribe(response => {
        if (response.status === 200) {
          resolve(response.product.imageUrl);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(err);
      });
    });
  }

  deleteProduct(productId) {
    return new Promise(( resolve, reject) => {
      this.httpClient.delete<ProductResponse>(this.productUrl + 'deletemainproduct/' + productId)
      .subscribe(response => {
        console.log(response.status);
        if (response.status === 200){
          // this.productDeleted(productId);
          resolve(true);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(this.proccessHttpErrorService.handleError(err));
      });
    });
  }

  getAllCategoriesId(){
    return new Promise(( resolve, reject) => {
    this.categoryService.notifyCategories()
      .subscribe(categories => {
        this.categoryIds = [];
        if (categories != null){
          categories.forEach(category => {
            this.categoryIds.push({category : category._id});
          });
          console.log(this.categoryIds);
          resolve(true);
        }
        });
    });
  }






  productDeleted(ProductId) {
    const deleteProduct = this.allProducts
    .find(currentProduct => {
      return currentProduct._id === ProductId;
    });
    this.allProducts.splice(this.allProducts.indexOf(deleteProduct), 1);
    this.notifyCategories();
  }

  productsUpdated(product: MainProduct) {
    const updatedProduct = this.allProducts
    .find(currentProduct => {
      return currentProduct._id === product._id;
    });
    this.allProducts[this.allProducts.indexOf(updatedProduct)] = product;
    this.notifyCategories();
  }

  notifyCategories() {
    this.products.next(this.allProducts);
    return this.products;
  }
}
