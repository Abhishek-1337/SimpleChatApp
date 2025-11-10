import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { registerSocket } from "./socket";
import * as chatController from "./controllers/chat.controller";

const app = express();

app.use(cors());

app.use(express.json());
export const prismaClient = new PrismaClient();

app.get("/", (req, res) => {
    res.send("hello");
} );

app.post("/register", async (req, res) => {
    const { username, color }: { username: string, color: string } = req.body;

    if(!username) {
        res.status(400).json({
            message: "Invalid input."
        });
        return;
    }

    const checkUser = await prismaClient.user.findFirst({
        where: {
            username
        }
    });
    if(checkUser) {
        res.status(400).json({
            message: "username already exist."
        });
        return;
    }

    const user = await prismaClient.user.create({
        data: {
            username,
            color
        }
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
                    Id: true,
                    text: true,
                    username: true
                }
            },
            user: {
                select: {
                    Id: true,
                    username: true,
                    color: true
                }
            }
        }
    });
    const chat = room?.messages.map((message) => {
        return {
            ...message,
            color: room.user.find((user) => user.username === message.username)?.color ?? ""
        }
    });

    if(!chat){
        res.status(400).json({
            message: "Room not found."
        });
        return;
    }

    res.status(200).json({
        chat
    });

});

app.post("/:slug/new", chatController.createChat);

export const server = app.listen(3000);

registerSocket(server);
