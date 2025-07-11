// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [followed, setFollowed] = useState(["Nancy Pelosi"]);

  const toggleFollow = (name) => {
    setFollowed((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  return (
    <UserContext.Provider value={{ followed, toggleFollow }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
