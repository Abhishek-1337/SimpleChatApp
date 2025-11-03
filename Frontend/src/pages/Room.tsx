import { useParams } from "react-router-dom";
import ChatLayout from "../components/layout/ChatLayout";
import { useEffect, useState } from "react";
import axios from "axios";

type Message = {
    text: string;
    username: string;
}

const Room = () => {
    const {slug} = useParams();
    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = async () => {
        const username = sessionStorage.getItem("username");
        try {
            const res = await axios.post(`http://localhost:3000/${slug}/new`, {
                message: text,
                username
            });
            setText("");
        }
        catch(ex){
            console.log(ex);
        }
    }

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/${slug}/chat`);
                setMessages(res.data.chat);
            }
            catch(ex){
                console.log(ex);
            }
        }

        getMessages();
    }, []);
    return (
        <ChatLayout>
            <div className="flex flex-col h-screen">
                <div className="flex-1">
                    <ul className="flex flex-col-reverse h-full p-4 gap-4">
                        {
                            messages.map((m, index) => {
                                return (
                                    <div className="flex gap-2 items-center">
                                        <div className="text-sm bg-blue-700 rounded-full p-1 text-white">{m.username.slice(0,3)}</div>
                                        <li key={`${Math.floor(Math.random()*10)}-index`}>{m.text}</li>
                                    </div>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="w-full flex mb-2 p-4">
                    <input 
                    type="text" 
                    placeholder="Type your message" 
                    className="px-2 mr-2 outline-2 py-2 rounded-md outline-slate-600 flex-1"
                    onChange={(e) => setText(e.target.value)}
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