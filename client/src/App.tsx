import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./features/home/pages/Home";
import ThesisDetails from "./features/thesis/pages/ThesisDetails";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Chats from "./features/chats/pages/Chats";
import AddThesis from "./features/add-thesis/AddThesis";
import MyTheses from "./features/my-theses/MyTheses";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thesis/:id" element={<ThesisDetails />} />
        <Route path="/search" element={<Home />} />
        <Route path="/my-theses" element={<MyTheses />} />
        <Route path="/saved" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/add-thesis" element={<AddThesis />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
