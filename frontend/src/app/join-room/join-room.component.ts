import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent implements OnInit {

    joinRoomForm!:FormGroup;
    fb = inject(FormBuilder);
    router = inject(Router);

    chatService = inject(ChatService);

    ngOnInit(): void {
      this.joinRoomForm = this.fb.group({
        user:['',Validators.required],
        room:['',Validators.required]
      })
    }
    joinRoom(){
      console.log(this.joinRoomForm.value);

      sessionStorage.setItem("user",this.joinRoomForm.value.user)

      this.chatService.joinRoom(this.joinRoomForm.value.user,this.joinRoomForm.value.room)
      .then(()=>{
        this.router.navigate(['chat']);
      }).catch((err)=>{
        console.log("error is ",err)
      });
      
    }


}
