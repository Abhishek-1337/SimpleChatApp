import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Room = {
    Id: number;
    slug: string;
}

const Rooms = React.memo(() => {
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
                    rooms.map((room: Room, index: number) => {
                        return (
                            <Link to={`/room/${room.slug}`} key={`${room.slug}-${index}`}>
                                <li className="border-2 rounded-md bg-white px-4 mb-4 cursor-pointer" >{room.slug}</li>
                            </Link>
                        )
                    })
                }
            </ul>
        </div>
    );
});

export default Rooms;