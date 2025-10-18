import { faker } from "@faker-js/faker";

export const generateMockAdoption = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    adopter: faker.database.mongodbObjectId(),
    pet: faker.database.mongodbObjectId(),
    adoptionDate: faker.date.past().toISOString(),
    status: faker.helpers.arrayElement(["adopted", "pending", "cancelled"]),
  };
};

export const generateMockAdoptions = (count) => {
  const adoptions = [];
  for (let i = 0; i < count; i++) {
    adoptions.push(generateMockAdoption());
  }
  return adoptions;
};
