import { Router } from "express";
import UserModel from "../dao/models/userModel.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    req.logger.info(
      "Consulta GET /users exitosa. Total de usuarios: " + users.length
    );
    res.status(200).json(users);
  } catch (error) {
    req.logger.error("Error al obtener todos los usuarios: " + error.message);
    res
      .status(500)
      .json({ error: "Error al obtener usuarios.", details: error.message });
  }
});

router.get("/:userId", validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      req.logger.warn(`Usuario con ID ${userId} no encontrado (404).`);
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    req.logger.info(`Usuario con ID ${userId} obtenido con éxito.`);
    res.status(200).json(user);
  } catch (error) {
    req.logger.error(
      `Error al obtener el usuario con ID ${req.params.userId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Error al obtener el usuario.", details: error.message });
  }
});

router.put("/:userId", validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      req.logger.warn(
        `Intento de actualizar ID ${userId}, pero el usuario no fue encontrado (404).`
      );
      return res
        .status(404)
        .json({ message: "Usuario no encontrado para actualizar." });
    }
    req.logger.info(`Usuario con ID ${userId} actualizado con éxito.`);
    res
      .status(200)
      .json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    req.logger.error(
      `Error al actualizar el usuario con ID ${userId}: ${error.message}`
    );
    res.status(500).json({
      error: "Error al actualizar el usuario.",
      details: error.message,
    });
  }
});

router.delete("/:userId", validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      req.logger.warn(
        `Intento de eliminar ID ${userId}, pero el usuario no fue encontrado (404).`
      );
      return res
        .status(404)
        .json({ message: "Usuario no encontrado para eliminar." });
    }
    req.logger.info(`Usuario con ID ${userId} eliminado con éxito.`);
    res
      .status(200)
      .json({ message: "Usuario eliminado con éxito", user: deletedUser });
  } catch (error) {
    req.logger.error(
      `Error al eliminar el usuario con ID ${userId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Error al eliminar el usuario.", details: error.message });
  }
});

router.post("/", async (req, res) => {
  const newUser = req.body;
  try {
    const result = await UserModel.create(newUser);
    req.logger.info(`Usuario creado con éxito. ID: ${result._id}`);
    res.status(201).json({ message: "Usuario creado con éxito", user: result });
  } catch (error) {
    req.logger.error(
      `Error al crear el usuario. Datos: ${JSON.stringify(
        newUser
      )} - Detalle: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Error al crear el usuario.", details: error.message });
  }
});

export default router;
