import { Injectable } from '@angular/core';
import { CategoryResponse } from 'src/app/interfaces/categoryResponse';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ProccessHttpErrosService } from '../proccess-http-erros.service';
import { AuthService } from '../auth.service';
import { Category } from 'src/app/interfaces/category';
import { Subject } from 'rxjs';
import { MainProduct } from 'src/app/interfaces/mainProduct';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  categoryUrl = config.baseURL + 'crm/';
  categories: Subject<Category[]> = new Subject<Category[]>();
  allCategories: Category[] = [];
  constructor(private httpClient: HttpClient,
              private proccessHttpErrorService: ProccessHttpErrosService,
              private authService: AuthService) { }

  getAllCategories() {
    return new Promise((resolve, reject) => {
      this.httpClient.get<CategoryResponse>(this.categoryUrl + 'category/allcategory')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.onGetAllCategories(response.category);
            resolve(response.category);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
    }

  updateCategory(category, categoryId) {
    return new Promise((resolve, reject) => {
      this.httpClient.put<CategoryResponse>(this.categoryUrl + 'category/updatecategory/' + categoryId , category)
        .subscribe(response => {
          if (response.status === 200) {
            this.categoriesUpdated(response.category);
            resolve(response.category);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  addCategory(category: Category){
    return new Promise((resolve, reject) => {
      this.httpClient.post<CategoryResponse>(this.categoryUrl + 'category/addcategory', category)
        .subscribe(response => {
          if (response.status === 200) {
            this.categoriesAdded(response.category);
            resolve(response.category);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
    }
  
  appendProducts(category:Category,selectedProducts: MainProduct[]){
    return new Promise((resolve, reject) => {
      this.httpClient.put<CategoryResponse>(this.categoryUrl + 'category/appendproducts/' + category._id ,{products: selectedProducts})
        .subscribe(response => {
          if (response.status === 200) {
            this.categoriesUpdated(response.category);
            resolve(response.category);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  getCategory(categoryId:string){
    return new Promise((resolve, reject) => {
      this.httpClient.get<CategoryResponse>(this.categoryUrl + 'category/getcategory/' + categoryId)
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.category);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }
  postImage(formData: FormData, categoryId) {

    return new Promise((resolve, reject) => {
    this.httpClient.post<CategoryResponse>(this.categoryUrl + 'files/addimage/' + categoryId, formData)
      .subscribe(response => {
        if (response.status === 200) {
          resolve(response.category.imageUrl);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(err);
      });
    });
  }

  deleteCategory(categoryId) {
    return new Promise(( resolve, reject) => {
      this.httpClient.delete<CategoryResponse>(this.categoryUrl + 'category/deletecategory/' + categoryId)
      .subscribe(response => {
        console.log(response.status);
        if (response.status === 200){
          this.categoryDeleted(categoryId);
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

  removeProductFromCategory(categoryId:string,productId:string){
    return new Promise(( resolve, reject) => {
      this.httpClient.delete<CategoryResponse>(this.categoryUrl + 'category/removeproduct/' +categoryId + '/product/' + productId)
      .subscribe(response => {
        console.log(response.status);
        if (response.status === 200){
          //this.categoryDeleted(categoryId);
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

 

  onGetAllCategories(categories: Category[]){
    this.allCategories = categories;
    this.notifyCategories();
  }

  categoriesAdded(category: Category) {
    this.allCategories.push(category);
    this.notifyCategories();
  }

  categoryDeleted(categoryId) {
    const deleteCategory = this.allCategories
    .find(currentCategory => {
      return currentCategory._id === categoryId;
    });
    this.allCategories.splice(this.allCategories.indexOf(deleteCategory), 1);
    console.log(this.allCategories);
    this.notifyCategories();
  }

  categoriesUpdated(category: Category) {
    const updatedCategory = this.allCategories
    .find(currentCategory => {
      return currentCategory._id === category._id;
    });
    this.allCategories[this.allCategories.indexOf(updatedCategory)] = category;
    this.notifyCategories();
  }

  notifyCategories() {
    setTimeout(() => {
      this.categories.next(this.allCategories);
    }, 100);
    return this.categories;
  }
}
