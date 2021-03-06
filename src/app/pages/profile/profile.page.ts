import { Component, Inject, OnInit } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from '../register/valueChanges';
import { UserService } from '../../services/user/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currentUser: User;
  toggle = false;
  profileForm: FormGroup;
  formErrors: any;
  submitted = false;
  image: any;
  constructor(private authService: AuthService,
              private interactionService: InteractionService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              @Inject('bucketURL') public bucketURL,
              ) {
  }

  ngOnInit() {
    this.getCurrentUser();
  }


  getCurrentUser() {
    this.currentUser = this.authService.user;
    this.buildReactiveForm();
  }

  buildReactiveForm() {
    this.profileForm = this.formBuilder.group({
      firstname : [this.currentUser.firstname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      lastname : [this.currentUser.lastname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });

    this.profileForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.profileForm);
        console.log(this.formErrors);
      });
  }

  update() {
    this.submitted = true;
    this.interactionService.createLoading('Updating your information')
      .then(() => {
        this.userService.updateUser(this.profileForm.value)
          .then((result: any) => {
            this.interactionService.hide();
            this.submitted = false;
            if (result && result !== false){
              this.currentUser = result;
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
    if (this.isFileImage(event.target.files[0])){
    this.interactionService.createLoading('Updating Your image !!')
      .then(() => {
        const formData = new FormData();
        console.log(event.target.files[0]);
        formData.append('file', event.target.files[0]);
        this.userService.postImage(formData)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result !== false){
              this.interactionService.createToast('Your image updated', 'success', 'bottom');
              this.currentUser.imageUrl = result;
            }
            else {
              this.interactionService.hide();
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.interactionService.hide();
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
    }
    else {
      this.interactionService.createToast('You must select an image !', 'danger', 'bottom');
    }
  }

  isFileImage(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
  
    return file && acceptedImageTypes.includes(file['type'])
  }

  ionViewDidEnter(){
    this.currentUser = this.authService.user;
    this.buildReactiveForm();
  }

}
