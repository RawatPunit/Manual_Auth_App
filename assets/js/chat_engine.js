class ChatEngine{
    constructor(chatBoxIdatboxId,userEmail){
        this.chatBoxId = $('#${chatBoxId}');
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();   //constructor call
        }
    }
    connectionHandler(){
        let self = this;
        this.socket.on('connect',function(){
            console.log('connection established using sockets...!');
            
            self.socket.emit('join_room',{
                user_email : self.userEmail,
                chatroom : 'codiel'
            });

            self.socket.on('user_joined',function(data){
                console.log('a user has joined',data);
            })
        });

        //change :: send a message on clicking the sned message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if(msg!= ''){
                self.socket.emit('send_message',{
                    message : msg,
                    user_email : self.userEmail,
                    chatroom : 'codiel'
                });
            }
        });

        self.socket.on('recieve_message',function(data){
            console.log('message recieved',data.message);
            
            let newMessage = $('<li>');

            let messageType = 'other-message';

            if(data.user_Email == self.userEmail){
                messageType = 'self-message'; 
            }
            newMessage.append($('<span>',{
                'html' : data.message
            }));

            newMessage.append($('<sub>',{
                'html' : data.user_email
            }));

        newMessage.addClass(messageType);
        $('#chat-message-list').append(newMessage);

        })
    }


}