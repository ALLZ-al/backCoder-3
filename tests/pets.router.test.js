import request from "supertest";
import app from "../app.js";
import { generateMockPet } from "../utils/pet.mocking.js";

describe("Tests Funcionales para Pets Router", () => {
  let testPetId;
  const initialPetData = {
    name: "Supertest Pet",
    species: "canine",
    birthDate: "2023-01-01",
  };
  const updatedSpecies = "feline";

  it("Debería crear una nueva mascota y devolver 201", async () => {
    const res = await request(app).post("/api/pets").send(initialPetData);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Mascota creada con éxito");
    expect(res.body.pet).toHaveProperty("_id");
    expect(res.body.pet.name).toBe(initialPetData.name);

    testPetId = res.body.pet._id;
  });

  it("Debería obtener una lista de mascotas y devolver 200", async () => {
    const res = await request(app).get("/api/pets");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("Debería obtener la mascota creada por ID y devolver 200", async () => {
    const res = await request(app).get(`/api/pets/${testPetId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testPetId);
    expect(res.body.species).toBe(initialPetData.species);
  });

  it("Debería actualizar la especie de la mascota y devolver 200", async () => {
    const res = await request(app)
      .put(`/api/pets/${testPetId}`)
      .send({ species: updatedSpecies });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Mascota actualizada con éxito");
    expect(res.body.pet.species).toBe(updatedSpecies);
  });

  it("Debería devolver 400 si se pasa un petId con formato inválido", async () => {
    const invalidId = "notavalidmongo_id";
    const res = await request(app).get(`/api/pets/${invalidId}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("no es un ObjectId válido");
  });

  it("Debería eliminar la mascota y devolver 200", async () => {
    const res = await request(app).delete(`/api/pets/${testPetId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Mascota eliminada con éxito");

    const checkRes = await request(app).get(`/api/pets/${testPetId}`);
    expect(checkRes.statusCode).toBe(404);
  });

  it("Debería devolver 404 al intentar eliminar una mascota que ya no existe", async () => {
    const res = await request(app).delete(`/api/pets/${testPetId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Mascota no encontrada para eliminar.");
  });
});
