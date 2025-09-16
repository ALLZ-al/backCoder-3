import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import mocksRouter from "./routes/mocks.router.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";

dotenv.config();

const app = express();
const PORT = 8080;

const mongo_url ="mongodb+srv://Allz:backCoder2024@backcoder.clgja.mongodb.net/";
mongoose
  .connect(mongo_url)
  .then(() => console.log("Conectado a la base de datos de MongoDB"))
  .catch((err) => console.error("Error al conectar a la base de datos:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/pets", petsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
