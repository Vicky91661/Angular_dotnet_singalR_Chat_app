using backend;
using backend.Hubs;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddCors(Options=>{
    Options.AddDefaultPolicy(builder=>{
        builder.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
// Register the IDictionary<string, UserRoomCoonection> as a singleton
builder.Services.AddSingleton<IDictionary<string, UserRoomCoonection>>(new Dictionary<string, UserRoomCoonection>()); 
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();
app.UseCors();
app.UseEndpoints(endpoint=>{
    endpoint.MapHub<ChatHub>("/chat");
});


app.Run();

