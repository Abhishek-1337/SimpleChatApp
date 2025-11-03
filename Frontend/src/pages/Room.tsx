import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const Room = () => {
    const {slug} = useParams();
    return (
        <MainLayout>
            {slug}
        </MainLayout>
    );
}

export default Room;