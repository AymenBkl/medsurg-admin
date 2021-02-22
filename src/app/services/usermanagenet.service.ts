import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/response';
import { config } from './config';

@Injectable({
  providedIn: 'root'
})
export class UsermanagenetService {
  
  userUrl = config.baseURL + 'account/user/';

  constructor(private httpClient: HttpClient) { }


  getPatients() {
    return new Promise((resolve, reject) => {
      this.httpClient.get<AuthResponse>(this.userUrl + "usermanagement/patients")
        .subscribe(response => {
          console.log(response);
        }, err => {
          console.log(err);
        });
    });
  }
}
