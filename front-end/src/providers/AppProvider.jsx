import { BrowserRouter } from "react";

const AppProvider = ({ children }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    )
}

export default AppProvider;