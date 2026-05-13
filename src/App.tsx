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
import Login from "./Pages/Login";
import Tratot_simple from "./Pages/Tratot_simple";
import Tratot_no_ai from "./Pages/Tratot_no_ai";
import LLM_taro_simple from "./Pages/LLM_taro_simple";

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
          <Route path="/login" element={<Login />} />
          <Route path="/contextapi_test" element={<ContextAPI_Test />} />
          <Route path="/tratot_simple" element={<Tratot_simple />} />
          <Route path="/tratot_no_ai" element={<Tratot_no_ai />} />
          <Route path="/llm_taro_simple" element={<LLM_taro_simple />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
