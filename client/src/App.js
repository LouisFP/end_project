// Imported components
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";

// React Router
import { Routes, Route } from "react-router-dom";

function App() {
  // Add useEffect for checking Login status and so retrieving cart

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
