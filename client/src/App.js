import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Edit from "./pages/Edit";
import Post from "./pages/Post";
import Navbar from "./pages/Navbar";
import Transfer from "./pages/Transfer";
import Pets from "./pages/Pets";
import "./style.css";
import Translate from "./pages/Translate";

function App() {


  return (
    // <div className="App">
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/translation" element={<Translate />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/Profile/:UserName" element={<Profile />} />
        <Route path="/Edit/:UserID" element={<Edit />} />
        <Route path="/Post/:UserName/:UserID" element={<Post />} />
        <Route path="/Transfer/:UserID" element={<Transfer />} />
      </Routes>
    </BrowserRouter>
    // </div>
  );
}



export default App;
