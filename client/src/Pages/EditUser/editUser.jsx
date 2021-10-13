import { useState, useEffect } from "react";

import "./editUser.css";

function EditUser() {
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [role, setRole] = useState();
  const [age, setAge] = useState();
  const [users, setUsers] = useState([]);

  const getAllUsers = () => {
    console.log("GETTING ALL USERS");
    fetch("http://mongo-express-service:5000")
      .then((res) => res.text())
      .then((res) => {
        console.log("RES", JSON.parse(res));
        return setUsers(JSON.parse(res));
      })
      .catch((err) => console.log(err));
  };

  const addUser = () => {
    console.log("5000");
    fetch("https://mongo-express-service/adduser", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          fname: fname,
          lname: lname,
          role: role,
          age: age,
        },
      }),
    })
      .then((res) => res.text())
      .then((res) => {
        console.log("RES");
      });
  };

  const handleAmendUserField = (event, field, value) => {
    if (event !== undefined) {
      event.preventDefault();
      switch (field) {
        case "fname":
          setFname(value);
          break;
        case "lname":
          setLname(value);
          break;
        case "role":
          setRole(value);
          break;
        case "age":
          setAge(value);
          break;
      }
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [fname, lname, role, age]);

  return (
    <div className="App">
      <h1 data-position="header">Testing Redis Cache</h1>

      <section data-position="add-quote">
        <h2>Add user</h2>
        <input
          type="text"
          placeholder=""
          value={fname}
          onChange={(event) =>
            handleAmendUserField(event, "fname", event.target.value)
          }
        />
        <input
          type="text"
          placeholder=""
          value={lname}
          onChange={(event) =>
            handleAmendUserField(event, "lname", event.target.value)
          }
        />
        <input
          type="text"
          placeholder=""
          value={role}
          onChange={(event) =>
            handleAmendUserField(event, "role", event.target.value)
          }
        />
        <input
          type="text"
          placeholder=""
          value={age}
          onChange={(event) =>
            handleAmendUserField(event, "age", event.target.value)
          }
        />
        <button onClick={() => addUser()}>Submit</button>
      </section>

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
