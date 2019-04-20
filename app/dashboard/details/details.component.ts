import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppServiceService } from 'src/app/app-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashServiceService } from 'src/app/dash-service.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public currentMeeting:any;
  public allMeetings:any;
  public title:any;
  public meetingId:any;
  public meetId:any;
  public userType:any;
  public userInfo:any;
  public user:any;
  constructor(
    public appService: AppServiceService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef,
    public dashService:DashServiceService,
    public socketService:SocketService

  ) { }

  ngOnInit() {
    this.userInfo=this.appService.getUserInfoFromLocalstorage();
  this.user=this.userInfo.firstName.concat(this.userInfo.lastName);
    this.title=Cookie.get('title');
    this.userType=Cookie.get('userType');
    console.log('The cookie stored title'+this.title);

    this.dashService.getAllMeetings().subscribe(
      data=>{
        this.allMeetings=data["data"];
        console.log("The length of the records is:"+ this.allMeetings.length);

        for(let x in this.allMeetings){
    
          console.log('The meetings list is'+this.allMeetings[x].title);
          console.log('The meetings list is'+this.allMeetings[x].meetingId);

          if(this.title.toLowerCase().trim().replace(/ +/g, "")===this.allMeetings[x].title.toLowerCase().trim().replace(/ +/g, "")){
           this.meetingId=this.allMeetings[x].meetingId;
            console.log("Was successful in getting the meetingId"+this.meetingId)
          Cookie.set('meetingId',this.meetingId);
          
          }
       
         }        
      
      },error=>{
        console.log("some error occured")
        console.log(error.errorMessage);
      })

     setTimeout(() => {

      this.meetId= Cookie.get('meetingId');
      this.dashService.getSingleMeetingInformation(  this.meetId) .subscribe(
        data => {
          //Cookie.delete('meetingId');
          this.currentMeeting = data["data"];
          
         
        }, error => {
          console.log(error.errorMessage);
        }
      )
    }, 3000);
     
     

  }//End of OnInit


  editThisMeeting() {
    this.socketService.updateEvent(this.user);
    console.log('Inside the editThisMeeting()');
    this.dashService.editBlog(this.currentMeeting.meetingId, this.currentMeeting).subscribe(
      data => {

        if(data.status===404){
          this.router.navigate(['/404']);
        }
        else if(data.status===500){
          this.router.navigate(['/500']);
        }
        else{
        this.toastr.success("Edit success");
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard']);
        }, 1000)

      }
      }, error => {
        this.toastr.error("Some error occured");

      }

    )
  }

 //Deleting the meeting by Admin 
 public deleteMeeting():any{
  console.log('Inside the deleteThisBlog()');

  this.dashService.deleteMeeting(this.currentMeeting.meetingId).subscribe(
    data=>{

      if(data.status===404){
        this.router.navigate(['/404']);
      }
      else if(data.status===500){
        this.router.navigate(['/500']);
      }
      else{
     this.toastr.success("Deleted successfully");
     setTimeout(()=>{
       this.router.navigate(['/admin-dashboard']);
     },1000)
    }
    },
    error=>{
      this.toastr.error("some error");
    }
  )
}

}
