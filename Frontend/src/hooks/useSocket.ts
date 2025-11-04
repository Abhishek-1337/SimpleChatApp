import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () =>  {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = io("http://localhost:3000", {
            transports: ["websocket"],
            auth: {
                username: sessionStorage.getItem("username")
            }
        });

        setSocket(socket);
        setLoading(false);

        socket.on("connect", () => {
            console.log("connnected to the server", socket.id);

            socket.emit("message", "Hey server");
        });

        return () => {
            socket.disconnect();
        }
    }, []);

    return {
        socket,
        loading
    };
}

export default useSocket;