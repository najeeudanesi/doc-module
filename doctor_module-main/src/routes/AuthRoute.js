import React from "react";
import { Navigate } from "react-router-dom";
import { logout } from "../utility/auth";
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};
const AuthRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const decodedJwt = parseJwt(token);



    if (!token) {
        return <Navigate to="/" replace />;
    }
    if (decodedJwt?.exp * 1000 < Date.now()) {
        logout();
        return <Navigate to="/" replace />;
    }
    return children;
};

export default AuthRoute;
