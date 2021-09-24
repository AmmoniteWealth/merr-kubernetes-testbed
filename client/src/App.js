import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EditUser from "./Pages/EditUser/editUser";
import Home from "./Pages/Home/home";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/editUser">
            <EditUser />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
