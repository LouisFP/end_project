// Imported components
import Login from "./components/Login/login";
import Home from "./components/Home/Home";

// React Router
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  // Add useEffect for checking Login status and so retrieving cart

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
