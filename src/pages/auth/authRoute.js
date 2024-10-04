import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';

const AuthRoute = () => {
    const session = sessionStorage.getItem('token');
    const location = useLocation();

    return session ? (
        <Outlet/>
    ) : (
        <Navigate to="/login" state={{from: location}} replace/>
    );
};

export default AuthRoute;