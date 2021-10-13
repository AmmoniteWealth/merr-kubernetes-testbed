import React from "react";
import { useHistory } from "react-router-dom";
import "./home.css";

function Home() {
  const history = useHistory();

  const navigateToEditUser = () => {
    history.push("/editUser");
  };

  return (
    <div className="App">
      <button onClick={() => navigateToEditUser()}>Edit User</button>
    </div>
  );
}

export default Home;
