import { generateMockUsers } from "../utils/user.mocking.js";
import { generateMockPets } from "../utils/pet.mocking.js";

describe("Tests Unitarios para Funciones de Mocking", () => {
  it("generateMockUsers debe devolver un array con la cantidad correcta de usuarios", () => {
    const count = 7;
    const users = generateMockUsers(count);

    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(count);
  });

  it("generateMockPets debe devolver objetos con las propiedades básicas de una mascota", () => {
    const pets = generateMockPets(1);
    const pet = pets[0];

    expect(pet).toHaveProperty("name");
    expect(pet).toHaveProperty("specie");
    expect(pet).toHaveProperty("birthDate");
    expect(typeof pet.name).toBe("string");
  });
});
