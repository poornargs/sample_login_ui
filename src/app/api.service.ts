
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  sessionTimeOut = new BehaviorSubject(false);
  constructor(
    public _http: HttpClient,
  ) {} 

  // tslint:disable-next-line:typedef
  callApi({ url, method, body = null }: { url: any; method: any; body?: any }) {
    console.log(`12123123123`, url, method, body);
    switch (method.toUpperCase()) {
      case 'POST':
        return this._http.post(
          url,
          body
        );

      case 'GET':
        return this._http.get(url);

      default:
        break;
    }

  }
}
