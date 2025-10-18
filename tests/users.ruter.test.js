import request from "supertest";
import app from "../app.js";
import { generateMockUser } from "../utils/user.mocking.js";

describe("Tests Funcionales para Users Router", () => {
  let testUserId;
  const initialUserData = {
    ...generateMockUser(),
    email: `functional@test.com`,
    password: "testpassword",
  };
  const updatedName = "UpdatedName";

  it("Debería crear un nuevo usuario y devolver 201", async () => {
    const res = await request(app).post("/api/users").send(initialUserData);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("_id");
    expect(res.body.user.email).toBe(initialUserData.email);

    testUserId = res.body.user._id;
  });

  it("Debería obtener el usuario creado por ID y devolver 200", async () => {
    const res = await request(app).get(`/api/users/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testUserId);
    expect(res.body.first_name).toBe(initialUserData.first_name);
  });

  it("Debería actualizar el nombre del usuario y devolver 200", async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .send({ first_name: updatedName });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.first_name).toBe(updatedName);
  });

  it("Debería eliminar el usuario y devolver 200", async () => {
    const res = await request(app).delete(`/api/users/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Usuario eliminado con éxito");

    const checkRes = await request(app).get(`/api/users/${testUserId}`);
    expect(checkRes.statusCode).toBe(404);
  });

  it("Debería fallar al crear un usuario con email duplicado y devolver 500", async () => {
    await request(app).post("/api/users").send(initialUserData);

    const res = await request(app).post("/api/users").send(initialUserData);

    expect(res.statusCode).toBe(500);
  });
});
