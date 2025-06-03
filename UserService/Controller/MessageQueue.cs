using System.Security.Cryptography;
using NetMQ;
using NetMQ.Sockets;
using System.Text.Json;

namespace UserService;

public class MessageQueue
{
    public static void SendEmail(String email, String username)
    {
        using (var requester = new PushSocket())
        {
            requester.Connect("tcp://EmailService:3000");


            var payload = new
            {
                to = email,
                subject = "User Created",
                text = $"user {username}"
            };

            string message = JsonSerializer.Serialize(payload);

            requester.SendFrame(message);
        
        }
    }
}