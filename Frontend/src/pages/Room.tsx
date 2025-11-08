import { useParams } from "react-router-dom";
import ChatLayout from "../components/layout/ChatLayout";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

type Message = {
    Id: string;
    text: string;
    username: string;
}

const Room = () => {
    const {slug} = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [username, setUsername] = useState<string | null>("");
    const [text, setText] = useState<string>("");

    console.log(messages);
    useEffect(() => {
        const soc = io("http://localhost:3000", {
            transports: ["websocket"],
            auth: {
                username
            }
        });

        setSocket(soc);

        soc.on("connect", () => {
            console.log("Connected", soc.id);
        });

        soc.on("message", (obj) => {
            console.log(obj);
            if(obj?.error){
                return;
            }
            setMessages((prev) => [...prev, obj]);
        });

        return () => {
            soc.disconnect();
        }
    }, [username]);

    useEffect(() => {
        if(!socket) return;
        if(socket.connected){
            socket.emit("join-room", {slug});
        }

    }, [socket?.connected]);

    const sendMessage = async () => {
        if(socket?.connected) {
            socket.emit("message", {slug, text});
        }
        setText("");

        // try {
        //     await axios.post(`http://localhost:3000/${slug}/new`, {
        //         message: text,
        //         username
        //     });
        //     setText("");
        // }
        // catch(ex){
        //     console.log(ex);
        // }
    }

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/${slug}/chat`);
                const messages = res.data.chat.reverse();
                setMessages(messages);
            }
            catch(ex){
                console.log(ex);
            }
        }
        setUsername(sessionStorage.getItem("username"));
        getMessages();
    }, []);
    return (
        <ChatLayout>
            <div className="max-h-screen">
                    <ul className="flex flex-col-reverse p-4 pb-20 h-screen overflow-y-scroll">
                        {
                            messages.map((m, index) => {
                                return (
                                    <div className={`flex gap-2 items-center ${m.username === username ? 'flex-row-reverse' : ''}`} key={m.Id}>
                                        <div className="text-sm bg-blue-700 rounded-full p-1 text-white">{m.username.slice(0,3)}</div>
                                        <li >{m.text}</li>
                                    </div>
                                )
                            })
                        }
                    </ul>
                <div className="flex mb-0 p-4 pt-1 absolute bottom-0 w-lg bg-slate-300 rounded-lg">
                    <input 
                    type="text" 
                    placeholder="Type your message" 
                    className="px-2 mr-2 outline-2 py-2 rounded-md outline-slate-600 w-full bg-white"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    // onKeyDown={(e) => e.key === 'Enter' ? }
                    />
                    <button
                    className="bg-blue-500 text-white px-2 py-2 rounded-md cursor-pointer"
                    onClick={sendMessage}
                    >Send</button>
                </div>
            </div>
        </ChatLayout>
    );
}

export default Room;