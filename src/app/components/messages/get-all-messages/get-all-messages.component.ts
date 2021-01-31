import { Message } from '../../../interfaces/message';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { ModalControllersMessages } from 'src/app/classes/modalController.messages';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-get-all-messages',
  templateUrl: './get-all-messages.component.html',
  styleUrls: ['./get-all-messages.component.scss'],
})
export class GetAllMessagesComponent implements OnInit {

  @Input('user') currentUser: User;
  messages: Message[] = [];
  messagesTotalReceived: {patients: Message[],pharmacies: Message[],all: Message[]} = {patients: [],pharmacies: [],all: []};
  messagesTotalSent: {patients: Message[],pharmacies: Message[],all: Message[]} = {patients: [],pharmacies: [],all: []};
  currentSegmentUser:string = 'all';
  currentSegmentType:string = 'recieved';
  messageController: ModalControllersMessages;
  constructor(private messagesService: MessagesService,
    private interactionService: InteractionService,
    private modalCntrl: ModalController) { 
      this.messageController = new ModalControllersMessages(modalCntrl);
    }

  ngOnInit() {
    this.subscribetoMessages()
    this.getAllMessages();
  }


  getAllMessages() {
    this.interactionService.createLoading("Loading Your Message !! ..")
      .then(() => {
        this.messagesService.getMessages()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              if (result.length != 0) {
                this.messages = result;
                this.filterMessages(result);
                this.interactionService.createToast('Your Messages has been loaded !', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('You dont have any messages !', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('No meesages Found !', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      })
  }

  subscribetoMessages() {
    this.messagesService.getMessagesSubject()
      .subscribe(messages => {
        this.messages = messages;
        this.filterMessages(this.messages);
      })
  }

  segmentChanged(event) {
    this.currentSegmentUser = event.detail.value;

  }

  segmentChanged1(event){
    this.currentSegmentType = event.detail.value;
  }


  filterMessages(messages: Message[]) {
    this.messagesTotalReceived = {patients: [],pharmacies: [],all: []};
    this.messagesTotalSent = {patients: [],pharmacies: [],all: []};
    messages.map(message => {
      if (message.from._id != this.currentUser._id){
        if (message.from.role === 'patient'){
          this.messagesTotalReceived.patients.push(message);
        }
        else if (message.from.role == 'pharmacy') {
          this.messagesTotalReceived.pharmacies.push(message);
        }
        this.messagesTotalReceived.all.push(message);
      }
      else {
        console.log(message);
        if (message.to.role === 'patient'){
          this.messagesTotalSent.patients.push(message);
        }
        else if (message.to.role == 'pharmacy') {
          this.messagesTotalSent.pharmacies.push(message);
        }
        this.messagesTotalSent.all.push(message);
      }
      
    });
    console.log(this.messagesTotalReceived);
  }


  callSendMessageController(selectedUser: User) {
    this.messageController.callAddMessage(this.currentUser,selectedUser);
  }



}



