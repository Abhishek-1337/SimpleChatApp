import express from "express";
import { PrismaClient } from "@prisma/client";
import { UserRooms } from "./types";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
const prismaClient = new PrismaClient();

const userRooms: UserRooms[] = [];

app.get("/", (req, res) => {
    res.send("hello");
} );

app.post("/register", async (req, res) => {
    const { username }: { username: string } = req.body;

    if(!username) {
        res.status(400).json({
            message: "Invalid input."
        });
        return;
    }

    const checkUser = userRooms.find((obj) => obj.username === username);
    if(checkUser) {
        res.status(400).json({
            message: "username already exist."
        });
        return;
    }

    const user = await prismaClient.user.create({
        data: {
            username
        }
    });
    userRooms.push({
        username,
        rooms: []
    });

    res.status(201).json({
        message: "User created",
        user
    });
    
});

app.get("/rooms", async (req, res) => {
    const rooms = await prismaClient.room.findMany({});
    res.status(200).json({
        rooms
    });
});

app.get('/:slug/chat', async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        },
        select : {
            slug: true,
            messages: {
                select : {
                    text: true,
                    username: true
                }
            }
        }
    });

    if(!room){
        res.status(400).json({
            message: "Room not found."
        });
        return;
    }

    res.status(200).json({
        chat:room.messages
    });

});

app.post("/:slug/new", async (req, res) => {
    const { message, username } = req.body;
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    if(!room) {
        res.status(404).json({
            message: "Room not found."
        });
        return;
    }

    await prismaClient.message.create({
        data: {
            text: message,
            username,
            roomId: room.Id
        }
    });

    res.status(201).json({
        message: "Message is saved."
    });
})

app.listen(3000);
