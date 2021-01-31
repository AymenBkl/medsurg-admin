import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalControllers } from '../../classes/modalControllers';
import { ModalController } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescriptions';
import { InteractionService } from '../../services/interaction.service';
import { map } from 'rxjs/operators';
import { Comment } from 'src/app/interfaces/comment';
import { Offer } from 'src/app/interfaces/offer';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescriptions.page.html',
  styleUrls: ['./prescriptions.page.scss'],
})
export class PrescriptionsPage implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  prescriptions: Prescription[];
  commentToAdd: Comment;
  offers: Offer[] | any;
  currentSegmentType: string = 'prescriptions';

  constructor(private authService: AuthService,
              private modalController: ModalController,
              private prescriptionService: PrescriptionService,
              private interactionService: InteractionService) {
                this.modalControllers = new ModalControllers(modalController);
              }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.getCurrentUser();

  }

  getCurrentUser() {
    this.currentUser = this.authService.user;
    this.buildPrescription();
  }


  buildPrescription(){
    this.interactionService.createLoading("Please Wait ! ")
      .then(() => {
        this.prescriptionService.getAllPrescriptions().
        then(async (data: any) => {
          console.log(data);
          if (data.length === 0 ){
            this.interactionService.createToast('No data found', 'primary', 'bottom');
          }
          else {
            this.prescriptions = data.sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            await this.sortComments();
            this.interactionService.hide();
          }
        })
        .catch(err => {
          this.interactionService.hide();
          this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
        });
      })
    
  }


  callPrescriptionPage(prescription: Prescription){
    this.modalControllers.callPrescriptionPage(this.currentUser, prescription);
  }




  segmentChanged(event){
    this.currentSegmentType = event.detail.value;
  }

  calculateCommentPrice(comment: Comment){
    let commentPrice = 0;
    comment.products.map(product => {
      commentPrice += product.product.price * product.quantity;
    })
    return commentPrice;
  }

  async sortComments(){
    await this.prescriptions.map(async (prescription) => {
      await prescription.comments.sort((a,b) => {
        return this.calculateCommentPrice(a) - this.calculateCommentPrice(b);
      })
    })
  }
}
