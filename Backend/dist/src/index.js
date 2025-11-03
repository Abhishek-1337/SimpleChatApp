"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prismaClient = new client_1.PrismaClient();
const userRooms = [];
app.get("/", (req, res) => {
    res.send("hello");
});
app.post("/register", async (req, res) => {
    const { username } = req.body;
    if (!username) {
        res.status(400).json({
            message: "Invalid input."
        });
        return;
    }
    const checkUser = userRooms.find((obj) => obj.username === username);
    if (checkUser) {
        res.status(400).json({
            message: "username already exist."
        });
        return;
    }
    userRooms.push({
        username,
        rooms: []
    });
    res.status(201).json({
        message: "User created"
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
        select: {
            slug: true,
            messages: {
                select: {
                    Id: true,
                    text: true,
                    username: true
                }
            }
        }
    });
    if (!room) {
        res.status(400).json({
            message: "Room not found."
        });
        return;
    }
    res.status(200).json({
        chat: room.messages
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
    if (!room) {
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
});
app.listen(3000);
//# sourceMappingURL=index.js.map