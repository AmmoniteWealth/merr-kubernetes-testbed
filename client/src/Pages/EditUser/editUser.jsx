import React, { useState, useEffect } from "react";

import "./editUser.css";

function EditUser() {
  const [fname, setFname] = useState();
  const [fnameNew, setFnameNew] = useState();
  const [lname, setLname] = useState();
  const [lnameNew, setLnameNew] = useState();
  const [role, setRole] = useState();
  const [roleNew, setRoleNew] = useState();
  const [age, setAge] = useState();
  const [ageNew, setAgeNew] = useState();
  const [users, setUsers] = useState([]);
  const [uidToEdit, setUidToEdit] = useState([]);

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
        return JSON.parse(res);
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
        setUidToEdit(value);
        break;
      case "fnameNew":
        EditUser({
          uid: uidToEdit,
          user: {
            fname: value,
            lname: lnameNew,
            role: roleNew,
            age: ageNew,
          },
        });
        setFnameNew(value);
        break;
      case "lnameNew":
        setLnameNew(value);
        break;
      case "roleNew":
        setRoleNew(value);
        break;
      case "ageNew":
        setAgeNew(value);
        break;
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [fname, lname, role, age, uidToEdit, fnameNew, lnameNew, roleNew, ageNew]);

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
          <input
            type="text"
            placeholder="first name"
            value={fnameNew}
            onChange={(event) =>
              handleAmendUserField(event, "fnameNew", event.target.value)
            }
          />
          <input
            type="text"
            placeholder="last name"
            value={lnameNew}
            onChange={(event) =>
              handleAmendUserField(event, "lnameNew", event.target.value)
            }
          />
          <input
            type="text"
            placeholder="role"
            value={roleNew}
            onChange={(event) =>
              handleAmendUserField(event, "roleNew", event.target.value)
            }
          />
          <input
            type="text"
            placeholder="age"
            value={ageNew}
            onChange={(event) =>
              handleAmendUserField(event, "ageNew", event.target.value)
            }
          />
          <button id="update-button">Edit user</button>
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
