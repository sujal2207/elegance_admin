import React from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import AddProduct from "./pages/product/addProduct";
import Navbar from "./pages/Navbar";
import ProductListing from "./pages/product/ProductListing";
import Category from "./pages/category/category";
import Offer from "./pages/offer/offer";
import Login from "./pages/login/login";
import AuthRoute from "./pages/auth/authRoute";

function App() {
    const location = useLocation();
    return (
        <>
            {location.pathname !== "/login" && <Navbar/>}
            <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route element={<AuthRoute/>}>
                    <Route path='/' element={<ProductListing/>}/>
                    <Route path='/add-product' element={<AddProduct/>}/>
                    <Route path='/category' element={<Category/>}/>
                    <Route path='/add-product/:id' element={<AddProduct/>}/>
                    <Route path='/offer' element={<Offer/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
