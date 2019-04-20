import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/operator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private url =  'http://api.vcoderlearn.com';


  constructor(
    public http: HttpClient

  ) { }

  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  /*For Admin control Local Storage*/
  public getAdminInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('adminInfo'));

  } // end getUserInfoFromLocalstorage


  public setAdminInfoInLocalstorage = (data) =>{

    localStorage.setItem('adminInfo', JSON.stringify(data))


  }


  /*For Search keyword Local Storage*/
  public getSearchFromLocalstorageTickets = () => {

    return JSON.parse(localStorage.getItem('search'));

  } // end getUserInfoFromLocalstorage


  public setSerachInLocalStorageTickets = (data) =>{

    localStorage.setItem('search', JSON.stringify(data))


  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('userType',data.userType)
      .set('countryCode',data.countryCode)

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

 

  
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))
      .set('userId',Cookie.get('userId'))

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function

  //Added for Forgot Password Functionality
  public forgotPassword(email): Observable<any> {
    const params=new HttpParams()
    .set('email',email);
    return this.http.post(`${this.url}/api/v1/users/forgotPassword`, params);

  }

  

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError
}
