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
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DashServiceService } from 'src/app/dash-service.service';



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
  selector: 'app-admins-control',
  templateUrl: './admins-control.component.html',
  styleUrls: ['./admins-control.component.css']
})
export class AdminsControlComponent implements OnInit {

  public userInfo: any;
  public firstTwo:any;
  public user:any;
  public userMailId:any;
  public allMeetings:any;
  //To get selected user details
  public adminUser:any;
  public userId:any;
 
 
 
  view: string = 'month';
 
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

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
   private _route:ActivatedRoute,
   ) { }
 
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
    //this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }
 
  
 
  ngOnInit() {
    this.currentYear=new Date().getFullYear();
   this.userInfo=this.appService.getUserInfoFromLocalstorage();
   this.user=this.userInfo.firstName.concat(this.userInfo.lastName);
     this.firstTwo=this.user.substring(0, 2).toUpperCase();
     this.userId=this._route.snapshot.paramMap.get('userId');

     this.dashService.getSingleUserId(this.userId) .subscribe(
      data => {
        
        Cookie.set('adminControlEmail',data["data"].email);        
       
      }, error => {
        console.log(error.errorMessage);
      }
    )
    setTimeout(()=>{
     this.userMailId=Cookie.get('adminControlEmail');
   
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
               start: startOfDay(new Date(this.allMeetings[x].fromDate)),
               end: endOfDay(new Date(this.allMeetings[x].toDate)),
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
       })
       this.refresh.next();
      },3000);
 
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
         this.router.navigate(['/']);
 
       } else {
         this.toastr.error(apiResponse.message)
 
       } // end condition
 
     }, (err) => {
       this.toastr.error('some error occured')
 
 
     });
 
 } // end logout
}
