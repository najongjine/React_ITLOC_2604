import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Maze from "./Pages/Maze";
import AiVtuber from "./Pages/AiVtuber";
import UnityGameCompo from "./Component/UnityGameCompo";
import ContextAPI_Test from "./Pages/ContextAPI_Test";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aivtuber" element={<AiVtuber />} />
          <Route path="/unitychan" element={<UnityGameCompo />} />
          <Route path="/maze" element={<Maze />} />
          <Route path="/contextapi_test" element={<ContextAPI_Test />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
