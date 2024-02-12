const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Read the JSON file
let userData = require("./userData.json");

// Get all users
app.get("/users", (req, res) => {
  res.json(userData);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const user = userData.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
});

// Add a new user
app.post("/users", (req, res) => {
  const id = req.params.id;
  const newUser = req.body;
  userData.push({ id: userData.length + 1, ...newUser });
  fs.writeFile("./userData.json", JSON.stringify(userData, null, 2), (err) => {
    if (err) throw err;
    res.json(newUser);
  });
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  userData = userData.map((user) => {
    if (user.id === userId) {
      return { ...user, ...updatedUser };
    }
    return user;
  });
  fs.writeFile("./userData.json", JSON.stringify(userData, null, 2), (err) => {
    if (err) throw err;
    res.json(updatedUser);
  });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  userData = userData.filter((user) => user.id !== userId);
  fs.writeFile("./userData.json", JSON.stringify(userData, null, 2), (err) => {
    if (err) throw err;
    res.send("User deleted successfully");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
