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
    const exp = sessionStorage.getItem("expTokenDate");
    const decodedJwt = parseJwt(token);

    console.log("Token:", token);
    console.log("Expiration:", exp);
    console.log("Current Time:", Date.now());


    if (!token) {
        console.error("No token found. Redirecting to login.");
        return <Navigate to="/" replace />;
    }

    const expDate = new Date(exp);

    // if (expDate < Date.now()) {
    //     console.error("Token expired. Logging out and redirecting to login.");
    //     logout();
    //     return <Navigate to="/" replace />;
    // }
    return children;
};

export default AuthRoute;
