import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsermanagenetService } from 'src/app/services/usermanagenet.service';
import { onValueChanged } from './valueChanges';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {

  patient: User;
  profileForm: FormGroup;
  formErrors:any;
  submitted: boolean = false;
  constructor(private userManagementService: UsermanagenetService,
              private navParams: NavParams,
              private formBuilder: FormBuilder,
              private interactionService: InteractionService,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.patient = this.navParams.get('patient');
    console.log(this.patient)
    this.buildReactiveForm();
  }


  buildReactiveForm() {
    if (this.patient){
      this.profileForm = this.formBuilder.group({
        firstname : [this.patient.firstname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
        lastname : [this.patient.lastname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      });
  
      this.profileForm.valueChanges
        .subscribe(user => {
          this.formErrors = onValueChanged(user, this.profileForm);
          console.log(this.formErrors);
        });
    }
    
  }

  update() {
    this.submitted = true;
    this.interactionService.createLoading('Updating User  information')
      .then(() => {
        console.log(this.patient._id)
        this.userManagementService.updateUser(this.patient._id,this.profileForm.value)
          .then((result: any) => {
            this.interactionService.hide();
            this.submitted = false;
            if (result && result !== false){
              this.interactionService.createToast('User Information Has Been Updated', 'success', 'bottom');
              this.modalCntrl.dismiss();
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

}
