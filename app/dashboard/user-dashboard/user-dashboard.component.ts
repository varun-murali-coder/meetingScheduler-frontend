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
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

 // @ViewChild('modalContent') modalContent: TemplateRef<any>;
 public userInfo: any;
 public firstTwo:any;
 public user:any;
 public userMailId:any;
 public allMeetings:any;
 //To disable to previous and next button
public flag1:boolean;
public flag2:boolean;
public currentYear:number;

//User alert-meeting reminder
public reminderTimings:string[]=[];
public timeSet:any;
public meetingTimer:any;



 view: string = 'month';

 viewDate: Date = new Date();
 events: CalendarEvent[] = [];


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
  public socketService:SocketService
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
  this.createMessage();
  this.editMessage();
  this.currentYear=new Date().getFullYear();
  this.userInfo=this.appService.getUserInfoFromLocalstorage();
  this.user=this.userInfo.firstName.concat(this.userInfo.lastName);
    this.firstTwo=this.user.substring(0, 2).toUpperCase();


    this.userMailId=Cookie.get('email');
    console.log("The users mail id is:"+this.userMailId)
  
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
         //Logic for reminder 
         if(new Date(this.allMeetings[x].fromDate).getDate()==new Date().getDate()){
         // public reminderTimings:object[];
          //public timeSet:object;
         console.log("The fromDate values is"+this.allMeetings[x].fromDate);
          this.reminderTimings.push(this.allMeetings[x].fromDate);
          this.setTimer(this.reminderTimings);
         }


      }
    }
      
      
      },error=>{
        console.log("some error occured")
        console.log(error.errorMessage);
      })
      this.refresh.next();


     

}

/*Function to get the broadcast create message*/ 
public createMessage():any{
  this.socketService.receiveCreateMessage().subscribe((data)=>{
console.log("Inside the subscribe method of createMessage"+data);
this.toastr.warning(data);
jQuery('#createMessage').html(data);

  })

}

public editMessage():any{
  this.socketService.receiveUpdateMessage().subscribe((data)=>{
console.log("Inside the subscribe method of createMessage"+data);
this.toastr.warning(data);
jQuery('#updateMessage').html(data);

  })

}

//Timer function

public setTimer(timings){
  for(let x in timings){
    if(new Date(timings[x]).getDate()==new Date().getDate()){
    var date=new Date(timings[x]).getTime();
    console.log(date);
    var ms=date-60000;
    var alarm = new Date(ms);
    var differenceInMs = alarm.getTime() - (new Date()).getTime();
    if(differenceInMs >0) {
      this.meetingTimer = setTimeout(this.initReminder, differenceInMs);


    }

     
          
    }
    
    }

}


public initReminder() {
  jQuery('#reminderModal').modal('show');
};

public snooze(){
    jQuery('#reminderModal').modal('hide');

    this.meetingTimer = setTimeout(this.initReminder, 5000); // After 5 seconds

}	
public cancelNotify(){
    jQuery('#reminderModal').modal('hide');

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
