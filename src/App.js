import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import SingleBoard from "./pages/SingleBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import Navbar from "./modules/Navbar";
import CreateBoardModal from "./components/CreateBoardModal";
import { useState } from "react";
import Invite from "./pages/Invite";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openModal, setOpenModal] = useState(false);
  const [searchBoard, setSearchBoard] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="App">
      <Router>
        {openModal && (
          <CreateBoardModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
          />
        )}

        <Navbar
          openCreateBoardModal={() => setOpenModal(true)}
          setSearchBoard={setSearchBoard}
          setIsFocused={setIsFocused}
          searchBoard={searchBoard}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return localStorage.getItem("user") ? (
                <Redirect to={`/${user?.name}/boards`} />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Route exact path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route
            exact
            path="/invite/:id"
            render={(props) => {
              if (localStorage.getItem("user")) {
                return <Invite />;
              }
              localStorage.setItem(
                "invite",
                JSON.stringify(props.location.pathname)
              );
              return <Redirect to="/login" />;
            }}
          />
          <Route
            path="/:userName/boards"
            render={() => (
              <Boards
                openCreateBoardModal={() => setOpenModal(true)}
                searchBoard={searchBoard}
                setSearchBoard={setSearchBoard}
              />
            )}
            exact
          />
          <Route
            path="/:userName/:projectId/"
            exact
            render={() => (
              <SingleBoard
                isFocused={isFocused}
                searchBoard={searchBoard}
                setIsFocused={setIsFocused}
              />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
