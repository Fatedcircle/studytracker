import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default MainLayout;