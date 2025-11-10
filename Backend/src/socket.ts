import { Server } from "socket.io";
import { UserRooms } from "./types";
import { prismaClient } from ".";

export const userRooms: UserRooms[] = [];

export const registerSocket = (server: any) => {
    const io = new Server(server, {
    cors: { 
        origin: '*',
        methods: ["GET", "POST"],
    }
});

io.on("connection", async (socket) => {
    console.log("Client connected", socket.id);
    const username = socket.handshake.auth.username;
    console.log(username);
    
    const user = await prismaClient.user.findFirst({
        where: {
            username
        }
    });

    if(!user) {
        console.log("disconnected");
        socket.disconnect();
        return;
    }

    socket.on("disconnect", () => {
      const index = userRooms.findIndex((user) => user.socketId === socket.id);
      if(index !== -1){
        userRooms.splice(index, 1);
      }
    });

    userRooms.push({
        username,
        rooms: [],
        socketId: socket.id
    });

    socket.on("join-room", (obj) => {
        const user = userRooms.find((user) => user.socketId === socket.id);
        user?.rooms.push(obj.slug);
        console.log(userRooms);
    });
    console.log(userRooms);

    socket.on("message", async (obj) => {
        console.log(obj);

        const room = await prismaClient.room.findFirst({
            where: {
                slug: obj.slug
            }
        });

        if(!room) {
            io.to(socket.id).emit("message", { error: true, message: "Invalid room name."});
            return;
        }
        const message = await prismaClient.message.create({
            data: {
                text: obj.text,
                username,
                roomId: room.Id
            }
        });
        for(let user of userRooms) {
            if(user.rooms.includes(obj.slug)){
                // if(user.socketId === socket.id){
                //     continue;
                // }
                io.to(user.socketId).emit("message", {
                    Id: message.Id,
                    text: obj.text,
                    username
                });
            }
        }
    });

    
});
}