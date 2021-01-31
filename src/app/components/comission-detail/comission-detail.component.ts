import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Commission } from 'src/app/interfaces/commission';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-comission-detail',
  templateUrl: './comission-detail.component.html',
  styleUrls: ['./comission-detail.component.scss'],
})
export class ComissionDetailComponent implements OnInit {

  commission: Commission;
  submitted:boolean = false;
  constructor(private navParams: NavParams,
              private modalCntrl: ModalController,
              private orderService: OrderService,
              private intercationService:InteractionService) { }

  ngOnInit() {}


  getCommission(){
    this.commission = this.navParams.get('commission');
  }

  back(){
    this.modalCntrl.dismiss();
  }

  updateCommission(){
    this.submitted = true;
    this.orderService.updateCommission(this.commission._id,this.commission.commission)
      .then((result:any) => {
        this.submitted = false;
        if (result && result != false){
          this.intercationService.createToast('You Commission has been Updated','success','bottom');
          this.back();
        }
        else {
          this.intercationService.createToast('Something Went Wrong !','danger','bottom');
        }
      })
      .catch(err => {
        this.submitted = false;
        this.intercationService.createToast('Something Went Wrong !','danger','bottom');
      })
  }

}
