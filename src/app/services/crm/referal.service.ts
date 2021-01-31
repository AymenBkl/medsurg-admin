import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Subject } from 'rxjs';
import { ReferalResponse } from 'src/app/interfaces/referalResponse';
import { Referal } from 'src/app/interfaces/referal';
import { OrderService } from './order.service';
import { Commission } from 'src/app/interfaces/commission';
@Injectable({
  providedIn: 'root'
})
export class ReferalService {

  referalUrl = config.baseURL + "crm/referal/";
  referals: Referal[];
  referalSubject: Subject<Referal[]> = new Subject<Referal[]>();
  referalCommission: Commission;
  constructor(private httpClient: HttpClient,
              private orderService: OrderService) {
                this.getReferalCommission();
               }


  updateReferl(referalId: string, referalCommision: number) {
    return new Promise((resolve, reject) => {
      this.httpClient.put<ReferalResponse>(this.referalUrl + 'updatereferal/' + referalId , {commision: referalCommision})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.updateReferal(response.message);
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

  getReferal(){
    return new Promise((resolve, reject) => {
      this.httpClient.get<ReferalResponse>(this.referalUrl + 'getallreferal')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.referals = response.message;
            this.referalSubject.next(this.referals);
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

  checkReferal(referalCode: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<ReferalResponse>(this.referalUrl + 'checkreferal',{code: referalCode})
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

  getReferalCommission(){
    return new Promise((resolve,reject)=> {
    this.orderService.getCommision()
      .then((result :Commission[]) => {
        console.log(result);
        const commision = result.filter(comis => {return comis.name == 'Referal'});
        if (commision && commision.length > 0){
          this.referalCommission = commision[0];
          resolve(this.referalCommission);
        }
      })
    })
  }

  getCommission(){
    return new Promise((resolve,reject)=> {
      if (this.referalCommission){
        resolve(this.referalCommission);
      }
      else {
        resolve(this.getReferalCommission());
      }
    })
  }


  getReferalSubject() {
    this.referalSubject.next(this.referals);
    return this.referalSubject;
  }


  updateReferal(referal: Referal){
    const ref = this.referals.find(x => x._id == referal._id);
    this.referals[this.referals.indexOf(ref)].commision = referal.commision;
    this.referalSubject.next(this.referals);
  }
}
