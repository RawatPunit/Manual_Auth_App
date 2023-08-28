module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);
    
    io.sockets.on('connection', function(socket){
        console.log('new connection recieved', socket.id);

        socket.on('disconnect',function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room',function(data){
            //person sent a request to join the room
            console.log('Joining request rec.',data);

            socket.join(data.chatroom); //making person joined the chatroom

            //a new user with details has joined the chatroom
            io.in(data.chatroom).emit('user joined',data) //notification 
        });
        //change :: detect send_message and broadcast to everyone in teh room
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('recieve_message',data)
        });

    });
}