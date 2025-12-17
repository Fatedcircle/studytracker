import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/details`);
      if (!response.ok) throw new Error("Cannot fetch user");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("❌ There is a problem with fetching the user:", error);
    }
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
