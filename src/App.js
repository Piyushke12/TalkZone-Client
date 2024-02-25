import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/HomePage/HomePage"
import ChatPage from "./components/ChatPage/ChatPage"
import socketIO from "socket.io-client"
import './App.css'

const socket = socketIO.connect(process.env.REACT_APP_SERVER_URL)
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/chat" element={<ChatPage socket={socket} />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;