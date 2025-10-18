import { Router } from "express";
import PetsModel from "../dao/models/petModel.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pets = await PetsModel.find();
    req.logger.info(
      "Consulta GET /pets exitosa. Se encontraron " + pets.length + " mascotas."
    );
    res.status(200).json(pets);
  } catch (error) {
    req.logger.error("Error al obtener todas las mascotas: " + error.message);
    res.status(500).json({
      error: "Error al obtener las mascotas.",
      details: error.message,
    });
  }
});

router.get("/:petId", validateObjectId, async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await PetsModel.findById(petId);
    if (!pet) {
      req.logger.warn(`Mascota con ID ${petId} no encontrada (404).`);
      return res.status(404).json({ message: "Mascota no encontrada." });
    }
    req.logger.info(`Mascota con ID ${petId} obtenida con éxito.`);
    res.status(200).json(pet);
  } catch (error) {
    req.logger.error(
      `Error al obtener la mascota con ID ${req.params.petId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Error al obtener la mascota.", details: error.message });
  }
});

router.post("/", async (req, res) => {
  const newPet = req.body;
  try {
    const result = await PetsModel.create(newPet);
    req.logger.info(`Mascota creada con éxito. ID: ${result._id}`);
    res.status(201).json({ message: "Mascota creada con éxito", pet: result });
  } catch (error) {
    res;
    req.logger
      .error(
        `Error al crear la mascota: ${
          error.message
        }. Datos enviados: ${JSON.stringify(newPet)}`
      )
      .status(500)
      .json({ error: "Error al crear la mascota.", details: error.message });
  }
});

router.put("/:petId", validateObjectId, async (req, res) => {
  try {
    const { petId } = req.params;
    const updatedData = req.body;
    const updatedPet = await PetsModel.findByIdAndUpdate(petId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedPet) {
      req.logger.warn(
        `Intento de actualizar ID ${petId}, pero la mascota no fue encontrada (404).`
      );
      return res
        .status(404)
        .json({ message: "Mascota no encontrada para actualizar." });
    }
    req.logger.info(`Mascota con ID ${petId} actualizada con éxito.`);
    res
      .status(200)
      .json({ message: "Mascota actualizada con éxito", pet: updatedPet });
  } catch (error) {
    req.logger.error(
      `Error al actualizar la mascota con ID ${petId}: ${error.message}`
    );
    res.status(500).json({
      error: "Error al actualizar la mascota.",
      details: error.message,
    });
  }
});

router.delete("/:petId", validateObjectId, async (req, res) => {
  try {
    const { petId } = req.params;
    const deletedPet = await PetsModel.findByIdAndDelete(petId);
    if (!deletedPet) {
      req.logger.warn(
        `Intento de eliminar ID ${petId}, pero la mascota no fue encontrada (404).`
      );
      return res
        .status(404)
        .json({ message: "Mascota no encontrada para eliminar." });
    }
    req.logger.info(`Mascota con ID ${petId} eliminada con éxito.`);
    res
      .status(200)
      .json({ message: "Mascota eliminada con éxito", pet: deletedPet });
  } catch (error) {
    req.logger.error(
      `Error al eliminar la mascota con ID ${petId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Error al eliminar la mascota.", details: error.message });
  }
});

export default router;
