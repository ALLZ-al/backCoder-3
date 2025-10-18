import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { addLogger } from "./utils/logger.js";

import mocksRouter from "./routes/mocks.router.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoptions.router.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const PORT = 8080;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de ejemplo con Swagger",
      version: "1.0.0",
      description: "Documentación de la API usando Swagger",
    },
  },
  apis: [__dirname + "/docs/*.yaml"],
};

const mongo_url =
  "mongodb+srv://Allz:backCoder2024@backcoder.clgja.mongodb.net/back-3";
mongoose
  .connect(mongo_url)
  .then(() => console.log("Conectado a la base de datos de MongoDB"))
  .catch((err) => console.error("Error al conectar a la base de datos:", err));

app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", usersRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
