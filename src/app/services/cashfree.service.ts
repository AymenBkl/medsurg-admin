import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config';

@Injectable({
  providedIn: 'root',
})
export class CashfreeService {

  constructor(private httpClient: HttpClient) { 
  }



  paymentStatus(orderId: string) {

    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append('orderId',orderId);
        this.httpClient.post('http://localhost:3000/https://test.cashfree.com/api/v1/order/info/status',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }

  
  
}
