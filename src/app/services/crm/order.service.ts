import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Subject } from 'rxjs';
import { Order } from 'src/app/interfaces/order';
import { OrderResponse } from 'src/app/interfaces/orderResponse';
import { Commission } from 'src/app/interfaces/commission';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderUrl = config.baseURL + "crm/orders/";
  orders: Order[] = [];
  orderSubject: Subject<Order[]> = new Subject<Order[]>();
  commissions: Commission[] = [];
  constructor(private httpClient: HttpClient) { 
    this.getCommision();
  }


  

  getOrders(){
    return new Promise((resolve, reject) => {
      this.httpClient.get<OrderResponse>(this.orderUrl + 'getallorders')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            console.log(response.message)
            this.orders = response.message;
            this.orderSubject.next(this.orders);
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err.status == 404) {
            resolve(false)
          }
          else {
            reject(err);
          }
        });
      });
  }

  payPharmacy(orderId:string,commission: number){
    return new Promise((resolve, reject) => {
      this.httpClient.put<OrderResponse>(this.orderUrl + 'paypharmacy/' + orderId, {payedByAdmin : 'PAID',commission:commission})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  payRefund(orderId:string,commission: number,refundId:string){
    return new Promise((resolve, reject) => {
      this.httpClient.put<OrderResponse>(this.orderUrl + 'payrerefund/' + orderId, {payedByAdmin : 'PAID',commission:commission,refundId:refundId})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  payReferal(orderId:string,commission: number,referalId:string){
    return new Promise((resolve, reject) => {
      this.httpClient.put<OrderResponse>(this.orderUrl + 'payreferal/' + orderId, {payedByAdmin : 'PAID',commission:commission,referalId:referalId})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  getRefunds(){
    return new Promise((resolve, reject) => {
      this.httpClient.get<OrderResponse>(this.orderUrl + 'allrefundsadmin')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err.status == 404) {
            resolve(false)
          }
          else {
            reject(err);
          }
        });
      });
  }

 getCommissions(){
  return new Promise((resolve, reject) => {

      this.httpClient.get<OrderResponse>(this.orderUrl + 'getcommission')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
            this.commissions = response.message;
          }
          else {
          }
        }, err => {

        });
      });
  }

  updateCommission(commissionId:string,commission:number){
    return new Promise((resolve, reject) => {
      this.httpClient.put<OrderResponse>(this.orderUrl + 'updatecommission/' + commissionId, {commission : commission})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }


  getOrderSubject() {
    this.orderSubject.next(this.orders);
    return this.orderSubject;
  }

  async getCommision(){
    return new Promise((resolve, reject) => {
    if (this.commissions == null || this.commissions.length == 0){
      resolve(this.getCommissions());
    } 
    else {
      resolve(this.commissions);
    }
  })
  }

  

}
