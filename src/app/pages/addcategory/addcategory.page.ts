import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { CategoryService } from '../../services/crm/category.service';
import { Category } from 'src/app/interfaces/category';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.page.html',
  styleUrls: ['./addcategory.page.scss'],
})
export class AddcategoryPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;

  user: User;
  currentSlide = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  currentCategory: Category = null;
  categoryForm: FormGroup;
  formErrors: any;
  submitted = false;
  subscription: Subject<User>;
  constructor(private authService: AuthService,
              private intercationService: InteractionService,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private navCntrl: NavController) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.buildReactiveForm();
}

ngAfterViewInit() {
  setTimeout(
    () => {
      if (this.slides) {
        this.slides.update();
      }
    }, 300
  );
}

buildReactiveForm() {
  this.categoryForm = this.formBuilder.group({
    name : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    description : ['', [Validators.required]],
  });

  this.categoryForm.valueChanges
    .subscribe(user => {
      this.formErrors = onValueChanged(user, this.categoryForm);
      console.log(this.formErrors);
    });
}

next() {
  this.slides.getActiveIndex()
    .then(index => {
      this.currentSlide = index + 1;
      this.slides.slideNext();
    });
}



finish() {
  if (this.currentCategory.imageUrl === ''){
    this.intercationService.alertWithHandler('You didnt select an image !', 'Alert' , 'STAY' , 'SELECT LATAR')
      .then(() => {
        this.navigateBack();
      });
  }
  else {
    this.navigateBack();
  }
}
  addCategory() {
    this.submitted = true;
    this.intercationService.createLoading('Adding Category !!')
      .then(() => {
        this.categoryService.addCategory(this.categoryForm.value)
          .then((result: any) => {
            this.submitted = false;
            this.intercationService.hide();
            if (result && result !== false){
              this.intercationService.createToast('Your category added succesfly', 'success', 'bottom');
              this.currentCategory = result;
              console.log(result);
            }
            else {
              this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.submitted = false;
        this.intercationService.hide();
        this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
  }

  selectedImage(event) {
    if (this.isFileImage(event.target.files[0])){

    this.intercationService.createLoading('Updating Your image !!')
      .then(() => {
        const formData = new FormData();
        console.log(event.target.files[0]);
        formData.append('file', event.target.files[0]);
        this.categoryService.postImage(formData, this.currentCategory._id)
          .then((result: any) => {
            this.intercationService.hide();
            if (result && result !== false){
              this.intercationService.createToast('Your image updated', 'success', 'bottom');
              this.currentCategory.imageUrl = result;
            }
            else {
              this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.intercationService.hide();
        this.intercationService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
    }
    else {
      this.intercationService.createToast('You must select an image !', 'danger', 'bottom');
    }
  }

  isFileImage(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
  
    return file && acceptedImageTypes.includes(file['type'])
  }

  navigateBack() {
    this.navCntrl.back();
  }


  ionViewDidEnter(){
  }
  ionViewDidLeave(){
  }

}



