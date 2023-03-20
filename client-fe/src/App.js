import React from "react";
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Blog from "./pages/Blog";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<Home />} />
          <Route path="login" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />

          <Route path="blogs" element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
