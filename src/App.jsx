import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import React from 'react'

import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./components/SignUp";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";
import Blog from "./pages/Blog";
import Checkout from "./pages/Checkout";
import Categories from "./pages/Categories";
import Error404 from "./pages/Error404";

const App = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with shared Navbar + Footer */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/blog" element={<Blog />} />
      </Route>

      {/* Standalone routes (own nav/layout) */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/categories" element={<Categories />} />

      {/* 404 - standalone full-screen */}
      <Route path="*" element={<Error404 />} />
    </>
  )
)

export default App;