import request from "supertest";
import app from "../app.js";
import { generateMockUser } from "../utils/user.mocking.js";
import { generateMockPet } from "../utils/pet.mocking.js";

const baseMockPet = generateMockPet(1)[0];

const mockUser = { ...generateMockUser(), email: "adoptertest@mail.com" };
const mockPet = {
  name: baseMockPet.name,
  species: "can",
};

describe("Tests Funcionales para Adoptions Router", () => {
  let adopterId;
  let petToAdoptId;
  let adoptionId;

  beforeAll(async () => {
    const userRes = await request(app).post("/api/users").send(mockUser);
    adopterId = userRes.body.user._id;

    const petRes = await request(app).post("/api/pets").send(mockPet);
    petToAdoptId = petRes.body.pet._id;
  });

  afterAll(async () => {
    await request(app).delete(`/api/users/${adopterId}`);
    await request(app).delete(`/api/pets/${petToAdoptId}`);
  });

  it("POST /api/adoptions - Debería crear una adopción con éxito (código 201)", async () => {
    const res = await request(app)
      .post("/api/adoptions")
      .send({ adopter: adopterId, pet: petToAdoptId });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Adopción creada con éxito");
    expect(res.body.adoption.adopter._id.toString()).toBe(adopterId);

    adoptionId = res.body.adoption._id;
  });

  it("POST /api/adoptions - Debería fallar (código 400) si la mascota ya fue adoptada", async () => {
    const res = await request(app)
      .post("/api/adoptions")
      .send({ adopter: adopterId, pet: petToAdoptId });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain(
      "ya está en proceso de adopción o fue adoptada"
    );
  });

  it("GET /api/adoptions/:adoptionId - Debería obtener la adopción con éxito (código 200)", async () => {
    const res = await request(app).get(`/api/adoptions/${adoptionId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.pet.name).toBe(mockPet.name);
    expect(res.body.adopter.email).toBe(mockUser.email);
  });

  it('PUT /api/adoptions/:adoptionId - Debería actualizar el estado a "cancelled" (código 200)', async () => {
    const newStatus = "cancelled";
    const res = await request(app)
      .put(`/api/adoptions/${adoptionId}`)
      .send({ status: newStatus });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Adopción actualizada con éxito");
    expect(res.body.adoption.status).toBe(newStatus);
  });

  it("DELETE /api/adoptions/:adoptionId - Debería eliminar la adopción con éxito (código 200)", async () => {
    const res = await request(app).delete(`/api/adoptions/${adoptionId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Adopción eliminada con éxito");

    const checkRes = await request(app).get(`/api/adoptions/${adoptionId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
