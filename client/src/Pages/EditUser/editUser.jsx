import { useState, useEffect } from "react";

import "./editUser.css";

function EditUser() {
  const [users, setUsers] = useState([]);

  const getAllUsers = () => {
    console.log("GETTING ALL USERS");
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((res) => {
        console.log("RES", JSON.parse(res));
        return setUsers(JSON.parse(res));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllUsers();
  }, [fname, lname, role, age]);

  return (
    <div className="App">
      <h1 data-position="header">Merr k8s testbed</h1>

      <section data-position="quotes">
        <h2>Console</h2>

        <ul className="quotes">
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <li className="quote">
                <span>{user._id}</span>
                <span>{user.user.fname}</span>
                <span>{user.user.lname}</span>:
                <ul>
                  <li>
                    {" "}
                    Role:
                    <span>{user.user.role}</span>
                  </li>
                  <li>
                    {" "}
                    Age:
                    <span>{user.user.age}</span>
                  </li>
                </ul>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

export default EditUser;
