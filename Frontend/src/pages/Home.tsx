import { useEffect, useState } from "react";
import Register from "../components/Register";
import Rooms from "../components/Rooms";
import MainLayout from "../components/layout/MainLayout";
// import { useNavigate } from "react-router-dom";

const Home = ( ) => {
    // const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    useEffect(() => {
        const username = sessionStorage.getItem("username");
        if(username) {
            setUsername(username);
            // navigate("/rooms");
        }
    }, []);
    return (
       <MainLayout>
        { !username && <Register setUsername={setUsername}/> }
        { username && <Rooms/> }
        </MainLayout>
    );
}

export default Home;