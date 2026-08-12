import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("smartstock_token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("smartstock_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (loginResponse) => {
    localStorage.setItem("smartstock_token", loginResponse.token);
    localStorage.setItem(
      "smartstock_user",
      JSON.stringify(loginResponse.user)
    );

    setToken(loginResponse.token);
    setUser(loginResponse.user);
  };

  const logout = () => {
    localStorage.removeItem("smartstock_token");
    localStorage.removeItem("smartstock_user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}