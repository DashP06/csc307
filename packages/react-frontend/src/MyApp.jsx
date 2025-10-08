// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([
    {
      name: "Charlie",
      job: "Janitor"
    }
  ]);

  function removeOneCharacter(index) {
    const userToDelete = characters[index];

    fetch(`http://localhost:8000/users/${userToDelete.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          // Only remove from frontend if backend confirms deletion
          const updated = characters.filter((_, i) => i !== index);
          setCharacters(updated);
        } else if (res.status === 404) {
          console.warn("User not found on backend, nothing deleted");
        } else {
          console.error("Failed to delete user, status:", res.status);
        }
      })
    .catch((error) => console.error("Error deleting user:", error));
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        }
      })
      .then((newUser) => setCharacters([...characters, newUser]))
      .catch((error) => console.log(error));
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  return (
    <div className="container">
        <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList} />
    </div>
    );
}

export default MyApp;