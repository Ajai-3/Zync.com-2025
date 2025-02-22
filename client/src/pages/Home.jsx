import React from "react";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-4">Welcome to Home</h1>
      <ThemeSwitcher />
    </div>
  );
};

export default Home;