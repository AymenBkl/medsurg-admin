import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { NavController , ModalController } from '@ionic/angular';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input('page') page:string;
  @Input('type') type:string;
  currentUser: User;
  constructor(private authService: AuthService,
              private navCntrl: NavController,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.getCurrentUser();
    console.log(this.type);
  }


  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  back() {
    this.navCntrl.back();
  }

  close(){
    this.modalCntrl.dismiss(null);
  } 
}
