import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import * as io from 'socket.io-client';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://api.vcoderlearn.com';

  private socket;

  constructor(public http: HttpClient,
    private toastr: ToastrService,
    ) {
     // connection is being created.
    // that handshake
    this.socket = io(this.url);
   }

public  createEvent=(user)=>{
  console.log("Got the user details"+user);
  this.socket.emit("create", user);
  


}
public receiveCreateMessage=()=>{
  console.log("Got the broadcasted message from server");
  return Observable.create((observer) => {
    this.socket.on("createMessage", (data)=>{
console.log("Inside receiveCreateMessage observer");
observer.next(data);  
  })
})
}


public  updateEvent=(user)=>{
  console.log("Got the user details"+user);
  this.socket.emit("update", user);
  


}
public receiveUpdateMessage=()=>{
  console.log("Got the broadcasted message from server");
  return Observable.create((observer) => {
    this.socket.on("updateMessage", (data)=>{
console.log("Inside receiveCreateMessage observer");
observer.next(data);  
  })
})
}


public exitSocket = () =>{


  this.socket.disconnect();


}// end exit socket

}
