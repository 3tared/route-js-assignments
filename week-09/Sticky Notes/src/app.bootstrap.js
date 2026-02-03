import { port } from "../config/config.service.js";
import { authenticateDB } from "./DB/connection.db.js";
import { authRouter, userRouter } from "./modules/index.js";
import express from "express";
import { noteRouter } from "./modules/note/index.js";
import { GlobalError } from "./middlewares/index.js";

async function bootstrap() {
  const app = express();
  //convert buffer data
  app.use(express.json());
  // DB
  await authenticateDB();
  //application routing
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/notes", noteRouter);
  //invalid routing
  app.use("{/*dummy}", (req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  //error-handling
  app.use(GlobalError);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default bootstrap;
