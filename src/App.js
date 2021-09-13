import "./App.css";
import img from "./assets/background2.jpg";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  console.log(img);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return localStorage.getItem("user") ? (
                <Redirect to="/home" />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Route
            path="/home"
            render={() => {
              return localStorage.getItem("user") ? (
                <Home />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
