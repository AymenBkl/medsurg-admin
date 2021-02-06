import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavController, NavParams } from '@ionic/angular';
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
  images: { url: any }[] = [];
  @ViewChild('slides') slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  constructor(private navParam: NavParams,
              private interactionService: InteractionService,
              private modalCntrl: ModalController) {
                this.modalControllers = new ModalControllers(modalCntrl);
               }

  ngOnInit() {
    this.getData();
    this.initImages();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = this.navParam.get('prescription');
    this.sortComments();
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

  initImages() {
    this.prescription.imageUrl.map((imageURL, i) => {
      this.images.push({ url: imageURL });
    })
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
