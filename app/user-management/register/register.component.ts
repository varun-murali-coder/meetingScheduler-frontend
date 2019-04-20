import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AppServiceService } from './../../app-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import{COUNTRYCODES} from './countryCodeList';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public apiKey: any;
  public countryCode:any;
  public repassword:any;
  public statusD:any;
  private CodeSelected:any;
  public fullName:any;
  public adminCheck:any;
  public userType:any;

  constructor(
    public appService: AppServiceService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    this.countryCode=COUNTRYCODES;
    this.statusD=1;
    console.log(this.countryCode);


        
    
  }
  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.warning('enter first name')
     

    } else if (!this.lastName) {
      this.toastr.warning('enter last name')

    } else if (!this.mobile) {
      this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')
     

    }  else {

      this.fullName=this.firstName.concat(this.lastName).toLowerCase();
      console.log("Full Name is:"+this.fullName);
      this.adminCheck=this.fullName.includes("admin");
      if(this.adminCheck){
       this.userType="admin";
       console.log('User Type is:'+this.userType);
      }else{
        this.userType="user";
        console.log('User Type is:'+this.userType);

      }
       console.log("The statusD is:"+this.statusD);
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        userType:this.userType,
        countryCode:this.countryCode[this.statusD-1].code
      }


      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {


          if (apiResponse.status === 200) {

            this.toastr.success('Signup successful');

            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction
}
