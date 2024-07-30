using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    
    public class ChatHub:Hub{
        private readonly IDictionary<string,UserRoomCoonection> _connection;

        public ChatHub(IDictionary<string,UserRoomCoonection> connection){
            Console.WriteLine("Connection is "+connection);
            _connection = connection;
        }
        public async Task JoinRoom(UserRoomCoonection userRoomCoonection){
            await Groups.AddToGroupAsync(Context.ConnectionId,userRoomCoonection.Room!);
            _connection[Context.ConnectionId]= userRoomCoonection;
            await Clients.Group(userRoomCoonection.Room!).SendAsync("ReceivedMessage","Lets Program Bot",$"{userRoomCoonection.User} has Joined the Group",DateTime.Now);
            await SendConnectedUser(userRoomCoonection.Room!);
            
        }

        public async Task SendMessage(string message){
            if(_connection.TryGetValue(Context.ConnectionId,out UserRoomCoonection userRoomCoonection)){
                await Clients.Group(userRoomCoonection.Room!).SendAsync("ReceivedMessage",userRoomCoonection.User,message,DateTime.Now);
            }
        }

        public Task SendConnectedUser(string room){
            var users = _connection.Values.Where(u=>u.Room ==room).Select(s=>s.User);
            return Clients.Group(room).SendAsync("ConnectedUser",users);
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if(!_connection.TryGetValue(Context.ConnectionId,out UserRoomCoonection userRoomCoonection)){
                return base.OnDisconnectedAsync(exception);
            }
            Clients.Group(userRoomCoonection.Room!).SendAsync("ReceivedMessage","Lets Program Bot",$"{userRoomCoonection.User} has left the Group",DateTime.Now);
            return SendConnectedUser(userRoomCoonection.Room!);
            
        }




    }
}