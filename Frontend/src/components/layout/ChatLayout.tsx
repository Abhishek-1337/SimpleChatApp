import type { ReactNode } from "react";
import MainLayout from "./MainLayout";

const ChatLayout = ({children}: {children: ReactNode}) => {
    return (
        <MainLayout>
            <div className="bg-slate-300 w-lg self-start max-h-screen"> 
                {children}
            </div>
        </MainLayout>
    );
}

export default ChatLayout;