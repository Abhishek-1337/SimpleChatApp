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
        console.log("hello2");
        socket.disconnect();
        return;
    }

    socket.on("disconnect", () => {
      console.log("hello")
    });

    userRooms.push({
        username,
        rooms: [],
        socket
    });

    
    socket.on("join-room", (obj) => {
        const user = userRooms.find((user) => user.username === obj.username)
        user?.rooms.push(obj.slug);
    });
    console.log(userRooms);

    socket.on("message", (msg) => {
        console.log(msg);
    });

    
});
}