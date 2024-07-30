import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection:signalR.HubConnection  = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5225/chat")
  .build();

  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages:any[]=[];
  public connectedUsers:string[]=[];

  constructor() {
    this.start();
    this.connection.on("ReceivedMessage",(user:string,message:string,messageTime:string)=>{
        this.messages = [...this.messages,{user,message,messageTime}];
        this.messages$.next(this.messages)
    })
    this.connection.on("ConnectedUser",(users:any)=>{
      this.connectedUsers= users;
      this.connectedUsers$.next(users);
      console.log("User:",users[0]);
      console.log("type of User:",typeof users);
    })
  }

  public async start(){
    try {
      this.connection.start();
    } catch (error) {
      console.log(error);
      setTimeout(()=>{
        this.start();
      },5000)
    }
  }

  // Join the room
  public async joinRoom(user:string,room:string){
    return this.connection.invoke("JoinRoom",{user,room})
  }

  // Send Messages
  public async sendMessage(message:string){
    return this.connection.invoke("SendMessage",message);
  }

  // leave
  public async leaveChat(){
    return this.connection.stop();
  }


}
