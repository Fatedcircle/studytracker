import { createContext, useContext } from "react";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const MockUserProvider = ({ user = null, logout = () => { }, children }) => {
    return (
        <UserContext.Provider value={{ user, logout }}>
            {children}
        </UserContext.Provider>
    );
};
