import React, { useState, useEffect } from "react";

import "./editUser.css";

function EditUser() {
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [role, setRole] = useState();
  const [age, setAge] = useState();
  const [users, setUsers] = useState([]);
  const [uidToEdit, setUidToEdit] = useState();

  const getAllUsers = () => {
    console.log("GETTING ALL USERS");
    fetch("http://localhost:8080/")
      .then((res) => res.text())
      .then((res) => {
        console.log("RES", JSON.parse(res));
        return setUsers(JSON.parse(res));
      });
  };

  const addUser = () => {
    console.log("8080");
    fetch("http://localhost:8080/adduser", {
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

  const getUser = (uid) => {
    console.log("Getting user", uid);
    fetch("http://localhost:8080/getuser", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: uid,
      }),
    })
      .then((res) => res.text())
      .then((res) => {
        console.log("GOT THIS USER", JSON.parse(res));
      });
  };

  const handleAmendUserField = (event, field, value) => {
    if (event !== undefined) {
      event.preventDefault();
    }
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
      case "uidToEdit":
        getUser(value);
        break;
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [fname, lname, role, age, uidToEdit]);

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

      <section data-position="update-quote">
        <div>
          <h2>Edit user</h2>
          <p>Edit an existing user by specifying their uid.</p>
          <input
            type="text"
            placeholder="uid"
            value={uidToEdit}
            onChange={(event) =>
              handleAmendUserField(event, "uidToEdit", event.target.value)
            }
          />
          <input type="text" placeholder="last name" name="chosen_lname" />
          <input type="text" placeholder="new first name" name="new_fname" />
          <input type="text" placeholder="new last name" name="new_lname" />
          <input type="text" placeholder="new role" name="new_role" />
          <input type="text" placeholder="new age" name="new_age" />
          <button id="update-button">Edit user</button>
        </div>
      </section>

      <section data-position="delete-quote">
        <div>
          <h2>Delete user</h2>
          <p>Delete user by specifying their surname.</p>
          <form action="/deleteuser" method="POST">
            <input type="text" placeholder="last name" name="del_lname" />
            <button id="delete-button">Delete User</button>
          </form>
        </div>
      </section>

      <section data-position="get-quotes">
        <div>
          <h2>Get user info</h2>
          <p>Search for an user and get their information.</p>
          <form action="/searchuser" method="POST">
            <input
              type="text"
              placeholder="last name"
              name="search_lname"
              id="search_lname"
            />
            <button id="search-button">Get User</button>
          </form>
        </div>
        <br></br>
        <div>
          <h2>Empty Cache</h2>
          <p>To empty cache please press below:</p>
          <form action="/emptycache" method="POST">
            <button id="empty-button">Empty Cache</button>
          </form>
        </div>
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
