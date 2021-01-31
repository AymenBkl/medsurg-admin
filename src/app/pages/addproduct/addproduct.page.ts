import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { CategoryService } from '../../services/crm/category.service';
import { ProductService } from '../../services/crm/product.service';
import { Product } from 'src/app/interfaces/product';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { ActivatedRoute } from '@angular/router';
import { MainProduct } from 'src/app/interfaces/mainProduct';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {


  user: User;
  currentProduct: MainProduct = null;
  type : string = '';
  category: Category;
  constructor(private authService: AuthService,
              private navCntrl: NavController,
              private activeRouter: ActivatedRoute) { }

  ngOnInit() {    
    this.user = this.authService.user;
    this.getCurrentRouter();
}

getCurrentRouter() {
  this.type = this.activeRouter.snapshot.paramMap.get('type');
  console.log(this.type);
  if (this.type &&  this.type != '' && this.type === 'edit-product'){
    const mainProduct = JSON.parse(this.activeRouter.snapshot.paramMap.get('mainproduct'));
    if (mainProduct && mainProduct != null){
    this.currentProduct = mainProduct;
  }
  }
  else if (this.type &&  this.type != '' && this.type === 'add-product') {
    const category = JSON.parse(this.activeRouter.snapshot.paramMap.get('category'));
    if (category && category != null){
      this.category= category;
  }
}
  
  

}

  navigateBack() {
    this.navCntrl.back();
  }


  ionViewDidEnter(){
    this.user = this.authService.user;
  }
  ionViewDidLeave(){
  }

}





