import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppServiceService } from 'src/app/app-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public firstTwo:any;
  private userInfo:any;
  private reporter:any;
  constructor(public appService:AppServiceService,public router: Router,
    private toastr: ToastrService,public socketService:SocketService,
    vcr: ViewContainerRef) { }

  ngOnInit() {
    this.userInfo=this.appService.getUserInfoFromLocalstorage();
    this.reporter=this.userInfo.firstName.concat(this.userInfo.lastName);
    this.firstTwo=this.reporter.substring(0, 2).toUpperCase();
  }
  public logout: any = () => {

    this.appService.logout()
      .subscribe((apiResponse) => {
  
        if (apiResponse.status === 200) {
          Cookie.delete('authtoken');
          localStorage.removeItem('userInfo');
          Cookie.delete('userId');
          Cookie.delete('email');
          Cookie.delete('title');
          Cookie.delete('userType');
          Cookie.delete('meetingId');
          this.socketService.exitSocket();


          this.router.navigate(['/']);
  
        } else {
          this.toastr.error(apiResponse.message)
  
        } // end condition
  
      }, (err) => {
        this.toastr.error('some error occured')
  
  
      });
  
  } // end logout

}
