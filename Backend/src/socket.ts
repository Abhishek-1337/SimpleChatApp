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

    socket.onAny((event, ...args) => {
  console.log("🔥 Event received:", event, args);
});

    socket.on("join-room", (obj) => {
        console.log("joiin")
        const user = userRooms.find((user) => user.socketId === socket.id);
        user?.rooms.push(obj.slug);
    });
    console.log(userRooms);

    socket.on("message", (msg) => {
        console.log(msg);
    });

    
});
}