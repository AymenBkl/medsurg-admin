import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
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
  constructor(private userManagementServoce: UsermanagenetService,
              private navParams: NavParams,
              private formBuilder: FormBuilder) { }

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

  update(){

  }

}
