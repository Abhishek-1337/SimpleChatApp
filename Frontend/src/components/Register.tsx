import { useState } from "react";

const Register = ({setUsername} : 
    {setUsername: React.Dispatch<React.SetStateAction<string>>}) => {
    const [input, setInput] = useState("");

    const registerUser = async () => {
        if(!input) {
            console.log("No username");
            return;
        }
        try{
            // const res = await axios.post('http://localhost:3000/register', {input});

            sessionStorage.setItem("username", input);
            setUsername(input);
        }
        catch(ex: any) {
            console.log(ex?.response.data.message);
        }

        setInput("");
    }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }
    return (
        <div className="bg-slate-200 p-8 rounded-xl shadow-md">
            <input 
            type="text" 
            placeholder="Enter user-name" 
            className="px-2 mr-2 outline-2 rounded-md"
            onChange={(e) => handleInputChange(e)}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    registerUser();
                }
            }}
            value={input}
            />
            <button 
            className="bg-blue-500 text-white px-2 rounded-md cursor-pointer"
            onClick={registerUser}
            >Register</button>
        </div>
    )
}

export default Register;