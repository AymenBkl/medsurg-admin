import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescriptions';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from '../../../services/interaction.service';
import { Comment } from 'src/app/interfaces/comment';
import { ModalControllers } from 'src/app/classes/modalControllers';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent implements OnInit {



  currentUser: User;
  prescription: Prescription;
  commentToAdd: Comment;
  modalControllers: ModalControllers;
  constructor(private navParam: NavParams,
              private interactionService: InteractionService,
              private modalCntrl: ModalController) {
                this.modalControllers = new ModalControllers(modalCntrl);
               }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = this.navParam.get('prescription');
    this.sortComments();
  }




  calculateCommentPrice(comment: Comment){
    let commentPrice = 0;
    comment.products.map(product => {
      commentPrice += product.product.price * product.quantity;
    })
    return commentPrice;
  }

  async sortComments(){
      await this.prescription.comments.sort((a,b) => {
        return this.calculateCommentPrice(a) - this.calculateCommentPrice(b);
      })
  }

}
