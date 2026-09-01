import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);


export const AuthProvider = ({
  children,
}) => {

  const [admin, setAdmin] =
    useState(() => {
      const storedAdmin =
        sessionStorage.getItem(
          "admin"
        );

      return storedAdmin
        ? JSON.parse(storedAdmin)
        : null;
    });


  /*
  =========================================
  LOGIN
  =========================================
  */

  const login = async (
    email,
    password
  ) => {

    const response =
      await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

    const {
      token,
      admin,
    } = response.data;


    /*
    =========================================
    STORE ADMIN SESSION
    =========================================
    */

    sessionStorage.setItem(
      "adminToken",
      token
    );

    sessionStorage.setItem(
      "admin",
      JSON.stringify(admin)
    );


    /*
    =========================================
    UPDATE REACT STATE
    =========================================
    */

    setAdmin(admin);

    return response.data;
  };


  /*
  =========================================
  LOGOUT
  =========================================
  */

  const logout = () => {

    sessionStorage.removeItem(
      "adminToken"
    );

    sessionStorage.removeItem(
      "admin"
    );

    setAdmin(null);
  };


  /*
  =========================================
  AUTH CHECK
  =========================================
  */

  const isAuthenticated =
    !!sessionStorage.getItem(
      "adminToken"
    );


  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


/*
=========================================
USE AUTH
=========================================
*/

export const useAuth = () => {
  return useContext(
    AuthContext
  );
};