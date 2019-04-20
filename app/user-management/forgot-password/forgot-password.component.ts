import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppServiceService } from 'src/app/app-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
public email:any;
public badRequest:any;
  constructor(
    public appService: AppServiceService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef
  ) { }

  ngOnInit() {
  }
  public sendEmail():any{
  
    this.appService.forgotPassword(this.email).subscribe((apiResponse)=>{
      this.toastr.success('An email has been sent to your mail Id');
      console.log(apiResponse);
    this.router.navigate(['/login']);
    },(err)=>{

      this.badRequest=err["status"];
      console.log('Bad Request'+this.badRequest);
      this.toastr.error('some error occured')
    })
  }

}
