import "./App.css";
import img from "./assets/background2.jpg";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import SingleBoard from "./pages/SingleBoard";
import Login from "./pages/Login";
import Boards from "./pages/Boards";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return localStorage.getItem("user") ? (
                <Redirect
                  to={`/${
                    JSON.parse(localStorage.getItem("user")).name
                  }/boards`}
                />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Route exact path="/login" component={Login} />
          <Route
            path="/:userName/:projectId/:title"
            component={SingleBoard}
            exact
          />
          <Route path="/:userName/boards" component={Boards} exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
