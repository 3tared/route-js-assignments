const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;
const USERS_FILE = path.resolve("./users.json");

app.use(express.json());

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function deleteUser(userId, res) {
  try {
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.id === parseInt(userId));

    if (userIndex === -1) {
      return res.status(404).json({ message: "User ID not found." });
    }

    users.splice(userIndex, 1);
    await writeUsers(users);

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
}
// 1. POST /user - Add a new user
app.post("/user", async (req, res) => {
  try {
    const { name, age, email } = req.body;
    if (!name || !age || !email) {
      return res
        .status(400)
        .json({ message: "Name, age, and email are required." });
    }
    const users = await readUsers();
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name,
      age,
      email,
    };
    users.push(newUser);
    await writeUsers(users);
    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});
// 2. PATCH /user/:id - Update user by ID
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, age, email } = req.body;
    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User ID not found." });
    }
    if (email !== undefined) {
      const emailExists = users.some(
        (user) => user.email === email && user.id !== userId
      );
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }
    if (name !== undefined) users[userIndex].name = name;
    if (age !== undefined) users[userIndex].age = age;
    if (email !== undefined) users[userIndex].email = email;
    await writeUsers(users);
    res.json({ message: "User age updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});
// 3a. DELETE /user - Delete user by ID
app.delete("/user", async (req, res) => {
  await deleteUser(req.body.id, res);
});
// 3b. DELETE /user/:id - Delete user by ID (from params)
app.delete("/user/:id", async (req, res) => {
  await deleteUser(req.params.id, res);
});
// 4. GET /user/getByName - Get user by name (query parameter)
app.get("/user/getByName", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Name query parameter is required." });
    }
    const users = await readUsers();
    const user = users.find(
      (user) => user.name.toLowerCase() === name.toLowerCase()
    );
    if (!user) {
      return res.status(404).json({ message: "User name not found." });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});
// 6. GET /user/filter - Filter users by minimum age
app.get("/user/filter", async (req, res) => {
  try {
    const { minAge } = req.query;
    if (!minAge) {
      return res
        .status(400)
        .json({ message: "minAge query parameter is required." });
    }
    const minimumAge = parseInt(minAge);
    const users = await readUsers();
    const filteredUsers = users.filter((user) => user.age >= minimumAge);
    if (filteredUsers.length === 0) {
      return res.status(404).json({ message: "No user found." });
    }
    res.json(filteredUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});
// 7. GET /user/:id - Get user by ID
app.get("/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await readUsers();
    const user = users.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});
// 5. GET /user - Get all users
app.get("/user", async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

app.all("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid Route" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
