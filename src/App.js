import "./App.css";
import img from "./assets/background2.jpg";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  console.log(img);
  return (
    <div
      className="App"
      style={{
        // backgroundImage: `url(${img})`,
        backgroundColor: "rgb(97 102 117)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
