import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class DashServiceService {

  public baseUrl = 'http://api.vcoderlearn.com/api/v1/meetings';
  public userUrl='http://api.vcoderlearn.com/api/v1/users';
  public authToken: any;

  constructor(private http: HttpClient) {


  }
/*Method to get the ticket details for Backlog*/
public getAllMeetings(): any {
  this.authToken = Cookie.get('authtoken');

  let myResponse = this.http.get(this.baseUrl + '/all?authToken=' +this.authToken);
  return myResponse;
}

 /*Method to create a new ticket*/
  public createMeeting(ticketData): any {
    this.authToken = Cookie.get('authtoken');
    let myResponse = this.http.post(this.baseUrl + '/create?authToken=' + this.authToken, ticketData);
    return myResponse;
  }

  /*Method to issue description page*/
  public getSingleMeetingInformation(currentMeetingId): any {
    console.log("The meetingId not getting passed"+currentMeetingId);
    this.authToken = Cookie.get('authtoken');
    let myResponse = this.http.get(this.baseUrl + '/view/' + currentMeetingId + '?authToken=' + this.authToken);
    return myResponse;
  }

  /*Method to get all the user list*/
public getAllUsers(): any {
  this.authToken = Cookie.get('authtoken');

  let myResponse = this.http.get(this.userUrl + '/all?authToken=' + this.authToken);
  return myResponse;
}

/*Method to get selected user calender*/
public getSingleUserId(currentUserId): any {
  console.log("The admin selected users is:"+currentUserId);
  this.authToken = Cookie.get('authtoken');
  let myResponse = this.http.get(this.userUrl + '/view/' + currentUserId + '?authToken=' + this.authToken);
  return myResponse;
}


  /*Method to edit meeting*/
  public editBlog(meetingId, ticketData): any {
    this.authToken = Cookie.get('authtoken');
    console.log('The edit functionality is working again'+meetingId);
    let myResponse = this.http.put(this.baseUrl + '/' + meetingId + '/edit?authToken=' + this.authToken, ticketData);
    return myResponse;


  }

  public deleteMeeting(meetingId):any{
    let data={};
    console.log('The Delete functionality is working again'+meetingId);
    let myResponse=this.http.post(this.baseUrl+'/'+meetingId+'/delete?authToken='+this.authToken,data);
    return myResponse;
  
  }


}
