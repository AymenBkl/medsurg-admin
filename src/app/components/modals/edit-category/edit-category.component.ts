import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { CategoryService } from '../../../services/crm/category.service';
import { InteractionService } from '../../../services/interaction.service';
import { Router } from '@angular/router';
import { MainProduct } from 'src/app/interfaces/mainProduct';
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {

  currentCategorie: Category;
  categoryForm: FormGroup;
  formErrors: any;
  image: any;
  toggle = false;
  submitted = false;
  categoryProducts: MainProduct[];
  constructor(private navParams: NavParams,
              private formBuilder: FormBuilder,
              private categoryService: CategoryService,
              private interactionService: InteractionService,
              private modalCntrl: ModalController,
              private router: Router ) { }

  ngOnInit() {
    this.getCategory();
  }

  buildReactiveForm() {
    this.categoryForm = this.formBuilder.group({
      name : [this.currentCategorie.name, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description : [this.currentCategorie.description, [Validators.required]],
    });

    this.categoryForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.categoryForm);
        console.log(this.formErrors);
      });
  }


  getCategory() {
    this.currentCategorie = this.navParams.get('category');
    this.buildReactiveForm();
  }

  update() {
    this.submitted = true;
    this.interactionService.createLoading('Updating your information')
      .then(() => {
        this.categoryService.updateCategory(this.categoryForm.value, this.currentCategorie._id)
          .then((result: any) => {
            this.interactionService.hide();
            this.submitted = false;
            if (result && result !== false){
              this.currentCategorie = result;
              this.interactionService.createToast('Your Information Has Been Updated', 'success', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.submitted = false;
            this.interactionService.hide();
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
          });
      });
  }

  selectedImage(event) {
    this.interactionService.createLoading('Updating Your image !!')
      .then(() => {
        const formData = new FormData();
        console.log(event.target.files[0]);
        formData.append('file', event.target.files[0]);
        this.categoryService.postImage(formData, this.currentCategorie._id)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result !== false){
              this.interactionService.createToast('Your image updated', 'success', 'bottom');
              this.currentCategorie.imageUrl = result;
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.interactionService.hide();
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
  }

  deleteCategory() {
    this.interactionService.alertWithHandler('Do you want to delete this category !', 'Alert' , 'CANCEL' , 'DELETE')
        .then(() => {
          this.categoryService.deleteCategory(this.currentCategorie._id)
            .then(result => {
              if (result && result === true){
                this.modalCntrl.dismiss();
              }
            });
        });
    }

  addProduct() {
    if (this.toggle){
      this.modalCntrl.dismiss();
      this.router.navigate(['/addproduct', {type:'add-product',category: JSON.stringify(this.currentCategorie)}]);
    }
  }

  

}
