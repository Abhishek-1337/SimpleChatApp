import axios from "axios";
import { useEffect, useState } from "react";

type Room = {
    Id: number;
    slug: string;
}

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const getAllRooms = async () => {
            try{
                const res = await axios.get("http://localhost:3000/rooms");
                setRooms(res.data.rooms);
            }
            catch(ex: any){
                console.log(ex.response.data.message);
            }
        }

        getAllRooms();

    },[]);       
    return (
        <div>
            <ul>    
                {
                    rooms.map((room: Room) => {
                        return (
                            <li className="border-2 rounded-md bg-white px-4 mb-4 cursor-pointer">{room.slug}</li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default Rooms;