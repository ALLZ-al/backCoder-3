import { Router } from "express";
import adoptionModel from "../dao/models/AdoptionModel.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import UserModel from "../dao/models/userModel.js";
import PetModel from "../dao/models/petModel.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const adoptions = await adoptionModel.find();
    req.logger.info(
      "Consulta GET /adoptions exitosa. Total: " + adoptions.length
    );
    res.status(200).json(adoptions);
  } catch (error) {
    req.logger.error("Error al obtener todas las adopciones: " + error.message);
    res.status(500).json({
      error: "Error al obtener las adopciones.",
      details: error.message,
    });
  }
});

router.get("/:adoptionId", validateObjectId, async (req, res) => {
  try {
    const { adoptionId } = req.params;
    const adoption = await adoptionModel.findById(adoptionId);

    if (!adoption) {
      req.logger.warn(`Adopción con ID ${adoptionId} no encontrada (404).`);
      return res.status(404).json({ message: "Adopción no encontrada." });
    }

    req.logger.info(`Adopción con ID ${adoptionId} obtenida con éxito.`);
    res.status(200).json(adoption);
  } catch (error) {
    req.logger.error(
      `Error al obtener la adopción con ID ${req.params.adoptionId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Error al obtener la adopción.", details: error.message });
  }
});

router.post("/", async (req, res) => {
  const { adopter, pet } = req.body;
  try {
    if (!adopter || !pet) {
      req.logger.warn("Intento de crear adopción sin adopter o pet ID.");
      return res.status(400).json({
        error: "Debe especificar el ID del adoptante y de la mascota.",
      });
    }

    const existingAdoption = await adoptionModel.findOne({ pet });
    if (existingAdoption) {
      req.logger.warn(
        `Intento de adoptar mascota ID ${pet} que ya está en adopción.`
      );
      return res.status(400).json({
        error: "La mascota ya está en proceso de adopción o fue adoptada.",
      });
    }

    const result = await adoptionModel.create({ adopter, pet });
    await UserModel.findByIdAndUpdate(adopter, { $push: { pets: pet } });
    await PetModel.findByIdAndUpdate(pet, { owner: adopter });
    req.logger.info(
      `Nueva adopción creada: User ${adopter} adoptó Pet ${pet}. ID: ${result._id}`
    );
    res
      .status(201)
      .json({ message: "Adopción creada con éxito", adoption: result });
  } catch (error) {
    req.logger.error(
      `Error al crear la adopción. Datos: ${JSON.stringify(
        req.body
      )} - Detalle: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Error al crear la adopción.", details: error.message });
  }
});

router.put("/:adoptionId", validateObjectId, async (req, res) => {
  try {
    const { adoptionId } = req.params;
    const updatedData = req.body;

    const updatedAdoption = await adoptionModel.findByIdAndUpdate(
      adoptionId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAdoption) {
      req.logger.warn(
        `Intento de actualizar adopción ID ${adoptionId}, pero no fue encontrada (404).`
      );
      return res
        .status(404)
        .json({ message: "Adopción no encontrada para actualizar." });
    }

    req.logger.info(
      `Adopción con ID ${adoptionId} actualizada a estado: ${updatedAdoption.status}.`
    );
    res.status(200).json({
      message: "Adopción actualizada con éxito",
      adoption: updatedAdoption,
    });
  } catch (error) {
    req.logger.error(
      `Error al actualizar la adopción con ID ${req.params.adoptionId}: ${error.message}`
    );
    res.status(500).json({
      error: "Error al actualizar la adopción.",
      details: error.message,
    });
  }
});

router.delete("/:adoptionId", validateObjectId, async (req, res) => {
  try {
    const { adoptionId } = req.params;
    const deletedAdoption = await adoptionModel.findByIdAndDelete(adoptionId);

    if (!deletedAdoption) {
      req.logger.warn(
        `Intento de eliminar adopción ID ${adoptionId}, pero no fue encontrada (404).`
      );
      return res
        .status(404)
        .json({ message: "Adopción no encontrada para eliminar." });
    }
    await UserModel.findByIdAndUpdate(deletedAdoption.adopter, {
      $pull: { pets: deletedAdoption.pet },
    });

    await PetModel.findByIdAndUpdate(deletedAdoption.pet, { owner: null });

    req.logger.info(`Adopción con ID ${adoptionId} eliminada con éxito.`);
    res.status(200).json({
      message: "Adopción eliminada con éxito",
      adoption: deletedAdoption,
    });
  } catch (error) {
    req.logger.error(
      `Error al eliminar la adopción con ID ${req.params.adoptionId}: ${error.message}`
    );
    res.status(500).json({
      error: "Error al eliminar la adopción.",
      details: error.message,
    });
  }
});

export default router;
