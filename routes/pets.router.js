import { Router } from "express";
import PetsModel from "../dao/models/petModel.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pets = await PetsModel.find();
    res.status(200).json(pets);
  } catch (error) {
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
      return res.status(404).json({ message: "Mascota no encontrada." });
    }
    res.status(200).json(pet);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener la mascota.", details: error.message });
  }
});

router.post("/", async (req, res) => {
  const newPet = req.body;
  try {
    const result = await PetsModel.create(newPet);
    res.status(201).json({ message: "Mascota creada con éxito", pet: result });
  } catch (error) {
    res
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
      return res
        .status(404)
        .json({ message: "Mascota no encontrada para actualizar." });
    }
    res
      .status(200)
      .json({ message: "Mascota actualizada con éxito", pet: updatedPet });
  } catch (error) {
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
      return res
        .status(404)
        .json({ message: "Mascota no encontrada para eliminar." });
    }
    res
      .status(200)
      .json({ message: "Mascota eliminada con éxito", pet: deletedPet });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar la mascota.", details: error.message });
  }
});

export default router;
