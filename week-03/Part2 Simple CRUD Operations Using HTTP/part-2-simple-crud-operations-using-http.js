// Part2: Simple CRUD Operations Using HTTP
// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// let port = 3000;
// const USERS_FILE = path.join(__dirname, "users.json");
// if (!fs.existsSync(USERS_FILE)) {
//   fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
// }
// function readUsersFromFile() {
//   try {
//     const data = fs.readFileSync(USERS_FILE, "utf8");
//     return JSON.parse(data);
//   } catch (error) {
//     console.error("Error reading users file:", error.message);
//     return [];
//   }
// }
// function writeUsersToFile(users) {
//   try {
//     fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
//     return true;
//   } catch (error) {
//     console.error("Error writing to users file:", error.message);
//     return false;
//   }
// }
// function parseBody(req) {
//   return new Promise((resolve, reject) => {
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });
//     req.on("end", () => {
//       try {
//         resolve(JSON.parse(body));
//       } catch (error) {
//         reject(error);
//       }
//     });
//     req.on("error", reject);
//   });
// }
// function sendResponse(res, statusCode, data) {
//   res.writeHead(statusCode, { "Content-Type": "application/json" });
//   res.end(JSON.stringify(data));
// }
// const server = http.createServer(async (req, res) => {
//   const { method, url } = req;
//   const urlParts = url.split("/").filter((part) => part !== "");

//   // route: POST /user - add new user
//   if (method === "POST" && url === "/user") {
//     try {
//       const newUser = await parseBody(req);

//       if (!newUser.name || !newUser.age || !newUser.email) {
//         return sendResponse(res, 400, {
//           message: "Missing required fields: name, age, email",
//         });
//       }
//       const users = readUsersFromFile();
//       const emailExists = users.some((user) => user.email === newUser.email);
//       if (emailExists) {
//         return sendResponse(res, 400, {
//           message: "Email already exists.",
//         });
//       }
//       const newId =
//         users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
//       newUser.id = newId;
//       users.push(newUser);
//       if (writeUsersToFile(users)) {
//         return sendResponse(res, 201, {
//           message: "User added successfully.",
//         });
//       } else {
//         return sendResponse(res, 500, {
//           message: "Error saving user",
//         });
//       }
//     } catch (error) {
//       return sendResponse(res, 400, {
//         message: "Invalid JSON",
//       });
//     }
//   }
//   // route: PATCH /user/:id - update user
//   else if (method === "PATCH" && urlParts[0] === "user" && urlParts[1]) {
//     try {
//       const userId = parseInt(urlParts[1]);
//       const updates = await parseBody(req);
//       const users = readUsersFromFile();
//       const userIndex = users.findIndex((user) => user.id === userId);
//       if (userIndex === -1) {
//         return sendResponse(res, 404, {
//           message: "User ID not found.",
//         });
//       }
//       if (updates.name !== undefined) users[userIndex].name = updates.name;
//       if (updates.age !== undefined) users[userIndex].age = updates.age;
//       if (updates.email !== undefined) users[userIndex].email = updates.email;
//       if (writeUsersToFile(users)) {
//         return sendResponse(res, 200, {
//           message: "User age updated successfully.",
//         });
//       } else {
//         return sendResponse(res, 500, {
//           message: "Error updating user",
//         });
//       }
//     } catch (error) {
//       return sendResponse(res, 400, {
//         message: "Invalid request",
//       });
//     }
//   }
//   // route: DELETE /user/:id - delete user
//   else if (method === "DELETE" && urlParts[0] === "user" && urlParts[1]) {
//     const userId = parseInt(urlParts[1]);
//     const users = readUsersFromFile();
//     const userIndex = users.findIndex((user) => user.id === userId);
//     if (userIndex === -1) {
//       return sendResponse(res, 404, {
//         message: "User ID not found.",
//       });
//     }
//     users.splice(userIndex, 1);
//     if (writeUsersToFile(users)) {
//       return sendResponse(res, 200, {
//         message: "User deleted successfully.",
//       });
//     } else {
//       return sendResponse(res, 500, {
//         message: "Error deleting user",
//       });
//     }
//   } else if (method === "GET" && url === "/user") {
//     const users = readUsersFromFile();
//     return sendResponse(res, 200, users);
//   } else if (method === "GET" && urlParts[0] === "user" && urlParts[1]) {
//     const userId = parseInt(urlParts[1]);
//     const users = readUsersFromFile();
//     const user = users.find((user) => user.id === userId);
//     if (!user) {
//       return sendResponse(res, 404, {
//         message: "User not found.",
//       });
//     }
//     return sendResponse(res, 200, user);
//   } else {
//     return sendResponse(res, 404, {
//       message: "Route not found",
//     });
//   }
// });
// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
