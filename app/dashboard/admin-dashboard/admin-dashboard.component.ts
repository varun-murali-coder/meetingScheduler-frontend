import { Component, OnInit,ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, 
  ViewContainerRef} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { ToastrService } from 'ngx-toastr';
import { AppServiceService } from 'src/app/app-service.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DashServiceService } from 'src/app/dash-service.service';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { SocketService } from 'src/app/socket.service';

declare var jQuery: any;


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
 // @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';
  public userInfo: any;
 public firstTwo:any;
 public user:any;

 //Modal Parameters
 public title:any;
 public sDate:Date;
 public eDate:Date;
public participants:any;
public agenda:any;
public partList:string[];
public allMeetings:any;
public userMailId:any;
public partEventList:any;
events: CalendarEvent[] = [];
viewDate: Date = new Date();
public currentUsers: any;
public normalUser:any=[];

//To disable to previous and next button
public flag1:boolean;
public flag2:boolean;
public currentYear:number;

  /*modalData: {
    action: string;
    event: CalendarEvent;
  };*/

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        //this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;

  constructor( public appService: AppServiceService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef,
    public dashService:DashServiceService,
    public socketService:SocketService) { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }


  ngOnInit() {
    this.currentYear=new Date().getFullYear();
    this.userMailId=Cookie.get('email');
    console.log("The users mail id is:"+this.userMailId)
    this.userInfo=this.appService.getUserInfoFromLocalstorage();
  this.user=this.userInfo.firstName.concat(this.userInfo.lastName);
    this.firstTwo=this.user.substring(0, 2).toUpperCase();
    console.log(Cookie.get('authtoken'));
    this.dashService.getAllMeetings().subscribe(
      data=>{

        if(data.status===404){
          this.router.navigate(['/404']);
        }
        else if(data.status===500){
          this.router.navigate(['/500']);
        }
        else{
        this.allMeetings=data["data"];
        for(let x in this.allMeetings){
    
          console.log('The meetings list is'+this.allMeetings[x].title);
          for(let y in this.allMeetings[x].participants){
            console.log("The email Ids in the list are :"+this.allMeetings[x].participants[y]);
            if(this.allMeetings[x].participants[y].toLowerCase().trim().replace(/ +/g, "")===this.userMailId.toLowerCase().trim().replace(/ +/g, "")){
              this.events.push(
               {
                 title: this.allMeetings[x].title,
                 start: addHours(startOfDay(new Date(this.allMeetings[x].fromDate)),parseInt(new Date(this.allMeetings[x].fromDate).toLocaleTimeString())),
                 end: addHours(startOfDay(new Date(this.allMeetings[x].toDate)),parseInt(new Date(this.allMeetings[x].toDate).toLocaleTimeString())),
                 color: colors.red,
                 resizable: {
                   beforeStart: true,
                   afterEnd: true
                 }
               })
               this.refresh.next();
             }
           }
         }  
        }      
      
      },error=>{
        console.log("some error occured")
        console.log(error.errorMessage);
      
    });


      //Loading the users list
      this.dashService.getAllUsers().subscribe(
        data => {
          this.currentUsers = data["data"];
          for(let x in this.currentUsers){
      if(this.currentUsers[x].userType!="admin"){
        this.normalUser.push(this.currentUsers[x]);
      }
          }
        }, error => {
          console.log(error.errorMessage);
        }
      )
            
  }
  

  
  handleEvent(action: string, event: CalendarEvent): void {
    console.log("The action is:"+action+"The event is"+event.title);
    Cookie.set('title',event.title);
    this.router.navigate(['/details']);

  }

  disablePrevious(date){
  if(this.currentYear===date.getFullYear() && date.getMonth()===0){

    this.flag1=true;
    this.flag2=false;
  }

  }
  disableNext(date){
    if(this.currentYear===date.getFullYear() && date.getMonth()===11){
  
      this.flag1=false;
      this.flag2=true;
    }
  
    }


  /*Function to create a meeting start*/
public createMeeting():any{
  this.socketService.createEvent(this.user);
  this.partList=this.participants.split(/[\s,;]+/).join(",");
  console.log("The from date is:"+this.sDate);
  console.log("The title is:"+this.title);
    let meetingData={
      title:this.title,
      fromDate:this.sDate.toLocaleString(),
      toDate:this.eDate.toLocaleString(),
      agenda:this.agenda,
      participants:this.partList,
      organizer:this.user
    }
    console.log("The meeting data is:"+meetingData)
    this.dashService.createMeeting(meetingData).subscribe(
      data=>{
        this.partEventList=this.participants.split(/[\s,;]+/);
        for(let x in this.partEventList ){
        if(this.userMailId.toLowerCase().trim().replace(/ +/g, "")===this.partEventList[x].toLowerCase().trim().replace(/ +/g, "")){
        this.events.push(
          {
            title: this.title,
            start: addHours(startOfDay(new Date(this.allMeetings[x].fromDate)),parseInt(new Date(this.allMeetings[x].fromDate).toLocaleTimeString())),
            end: addHours(startOfDay(new Date(this.allMeetings[x].toDate)),parseInt(new Date(this.allMeetings[x].toDate).toLocaleTimeString())),
            color: colors.red,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
          })
          this.refresh.next();
        }
  
      }
      this.toastr.success('Meeting Created Successfully'); 
      setTimeout(()=>{
    jQuery("#createMeeting").modal('hide');
        this.router.navigate(['/admin-dashboard']);
        },1000)
      this.refresh.next();
      

      },
      error=>{
        this.toastr.error("Some error occured");
       
       }
    )
   }
   /*Function to create a meeting stop*/

  public logout: any = () => {

    this.appService.logout()
      .subscribe((apiResponse) => {
  
        if (apiResponse.status === 200) {
          Cookie.delete('authtoken');
          localStorage.removeItem('userInfo');
          Cookie.delete('userId');
          Cookie.delete('email');
          Cookie.delete('userType');
          Cookie.delete('title');
          Cookie.delete('adminControlEmail');
          Cookie.delete('meetingId');
          this.socketService.exitSocket()
          this.router.navigate(['/']);
  
        } else {
          this.toastr.error(apiResponse.message)
  
        } // end condition
  
      }, (err) => {
        this.toastr.error('some error occured')
  
  
      });
  
  } // end logout

  

}
