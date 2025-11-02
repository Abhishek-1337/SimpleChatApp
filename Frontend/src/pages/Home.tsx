import { useEffect, useState } from "react";
import Register from "../components/Register";
import Rooms from "../components/Rooms";
// import { useNavigate } from "react-router-dom";

const Home = ( ) => {
    // const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    useEffect(() => {
        const username = localStorage.getItem("username");
        if(username) {
            setUsername(username);
            // navigate("/rooms");
        }
    }, []);
    return (
        <div className="bg-slate-400 min-h-screen flex items-center justify-center">
        { !username && <Register setUsername={setUsername}/> }
        { username && <Rooms/> }
        </div>
    );
}

export default Home;