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
import Navbar from "./modules/Navbar";
import CreateBoardModal from "./components/CreateBoardModal";
import { useState } from "react";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="App">
      <Router>
        {openModal && (
          <CreateBoardModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
          />
        )}

        <Navbar openCreateBoardModal={() => setOpenModal(true)} />
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
          <Route
            path="/:userName/:projectId/:title"
            component={SingleBoard}
            exact
          />
          <Route path="/login" component={Login} />
          <Route path="/:userName/boards" component={Boards} exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
