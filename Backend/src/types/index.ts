import { Socket } from "socket.io";

export type UserRooms = {
    username: string;
    rooms: number[];
    socketId: string;
}