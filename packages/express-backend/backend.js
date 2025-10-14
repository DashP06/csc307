import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userServices
    .getUsers(name, job)
    .then((users) => res.json({ users_list: users }))
    .catch((error) => res.status(500).json({ error: error.message }));
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  userServices
    .findUserById(id)
    .then((user) => {
      if (!user) res.status(404).send("Resource not found.");
      else res.json(user);
    })
    .catch(() => res.status(400).send("Invalid id."));
});

app.post("/users", (req, res) => {
  const user = req.body;
  userServices
    .addUser(user)
    .then((createdUser) => res.status(201).json(createdUser))
    .catch((error) => res.status(400).json({ error: error.message }));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  import("./user.js").then(({ default: userModel }) => {
    userModel
      .findByIdAndDelete(id)
      .then((result) => {
        if (!result) res.status(404).send("User not found.");
        else res.status(204).send();
      })
      .catch(() => res.status(400).send("Invalid id."));
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
