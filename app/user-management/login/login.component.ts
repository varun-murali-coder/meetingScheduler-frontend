import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { AppServiceService } from './../../app-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model:any={};
  public email: any;
  public password: any;
  public badRequest:number;
  constructor(
    public appService: AppServiceService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef
  ) { }

  ngOnInit() {
  }
  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

             Cookie.set('authtoken', apiResponse.data.authToken);
            
             Cookie.set('userId', apiResponse.data.userDetails.userId);
             Cookie.set('email',apiResponse.data.userDetails.email);
             Cookie.set('userType',apiResponse.data.userDetails.userType);

            
           
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
             console.log("login"+Cookie.get('authtoken'));
             console.log("The user type is:"+apiResponse.data.userDetails.userType)
            if(apiResponse.data.userDetails.userType==="admin"){
              console.log("Entered Admin block")
             this.router.navigate(['/admin-dashboard']);
            }else{
              console.log("Entered User block")
             this.router.navigate(['/user-dashboard']);
            }

          } else {
              
            this.toastr.error(apiResponse.message)
          

          }

        }, (err) => {
          this.badRequest=err["status"];
          console.log('Bad Request'+this.badRequest);
          this.toastr.error('some error occured')

        });

    } // end condition

  } // end signinFunction

  public forgetPassword():any{
    this.router.navigate(['/fogot-password']);
  }
}
