import { prismaClient } from "../index";
import { Request, Response } from "express";

export const createChat = async (req : Request, res: Response) => {
    const { message, username } = req.body;
    const slug = req.params.slug;
    if(!slug) {
        res.status(400).json({
            message: "Invalid input."
        });
        return;
    }
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
};