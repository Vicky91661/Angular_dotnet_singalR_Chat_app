import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  inputMessage = "";
  messages:any[] = [];
  router = inject(Router)
  loggedInUserName = sessionStorage.getItem('user');

  ngOnInit(): void {
    this.chatService.messages$.subscribe(res=>{
      this.messages=res;
      console.log("logged in user are",this.loggedInUserName);
      console.log("logged in user type",typeof this.loggedInUserName);
    })
  }


  sendMessage(){
    this.chatService.sendMessage(this.inputMessage)
    .then(()=>{
      this.inputMessage = '';
    }).catch((err)=>{
      console.log(err)
    })
  }

  leaveChat(){
    this.chatService.leaveChat()
    .then(()=>{
      console.log("successfully leaved the chat");
      this.router.navigate(['welcome']);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

}
