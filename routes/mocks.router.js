import { Router } from "express";
import { generateMockUsers } from "../utils/user.mocking.js";
import { generateMockPets } from "../utils/pet.mocking.js";
import UserModel from "../dao/models/userModel.js";
import PetModel from "../dao/models/petModel.js";

const router = Router();

router.get("/mockingpets", (req, res) => {
  try {
    const pets = generateMockPets(100);
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({
      error: "Error al generar mascotas mock.",
      details: error.message,
    });
  }
});

router.get("/mockingusers", (req, res) => {
  try {
    const users = generateMockUsers(50);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "Error al generar usuarios mock.",
      details: error.message,
    });
  }
});

router.post("/generateData", async (req, res) => {
  const { users: numUsers, pets: numPets } = req.body;
  if (numUsers === undefined || numPets === undefined) {
    return res.status(400).json({
      error:
        "Debe especificar el número de 'users' y 'pets' en el cuerpo de la petición.",
    });
  }
  if (
    typeof numUsers !== "number" ||
    typeof numPets !== "number" ||
    numUsers < 0 ||
    numPets < 0
  ) {
    return res.status(400).json({
      error: "Los parámetros 'users' y 'pets' deben ser números positivos.",
    });
  }

  try {
    const usersToInsert = generateMockUsers(numUsers);
    const insertedUsers = await UserModel.insertMany(usersToInsert);

    const petsToInsert = generateMockPets(numPets);
    const insertedPets = await PetModel.insertMany(petsToInsert);

    res.status(201).json({
      message: `${numUsers} usuarios y ${numPets} mascotas generados e insertados con éxito.`,
      usersInserted: insertedUsers.length,
      petsInserted: insertedPets.length,
    });
  } catch (error) {
    console.error("Error al generar e insertar datos:", error);
    res.status(500).json({
      error: "Error al generar e insertar datos.",
      details: error.message,
    });
  }
});

export default router;
