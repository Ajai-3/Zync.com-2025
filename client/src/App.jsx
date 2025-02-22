import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProviderComponent from "./theme/ThemeContext.jsx";
import "./index.css";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));

const App = () => {
  return (
    <ThemeProviderComponent>
      <BrowserRouter>
        <div className="min-h-screen">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/about" element={<h1>About</h1>} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ThemeProviderComponent>
  );
};

export default App;