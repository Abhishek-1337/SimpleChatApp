import type { ReactNode } from "react";

const MainLayout = ({children}: {children: ReactNode}) => {
    return (
        <div className="bg-slate-400 min-h-screen flex items-center justify-center">
            {children}
        </div>
    );
}

export default MainLayout;