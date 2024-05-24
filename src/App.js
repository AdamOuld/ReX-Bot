import Home from "./pages/Home";
import Chat from "./pages/Chat";
import EndedChats from "./pages/EndedChats";
import Activity from "./pages/Activity";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/newchat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/allchats" element={<EndedChats />} />
        <Route path="/activity" element={<Activity />} />
      </Routes>
    </Router>
  );
}

export default App;
