import RacePage from "./pages/RacePage";
import QuizPage from "./pages/QuizPage";
import TeamPage from "./pages/TeamPage";
import DriverPage from "./pages/DriverPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import './App.css';
import react from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          {/* //"Home", change later if we want another home page */}
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/driver" element={<DriverPage />}></Route>
          <Route path="/team" element={<TeamPage />}></Route>
          <Route path="/race" element={<RacePage />}></Route>
          <Route path="/quiz" element={<QuizPage />}></Route>
          <Route path="*" element="Oops! an error has occurred"></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;