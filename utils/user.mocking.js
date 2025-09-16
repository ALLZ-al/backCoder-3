import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const generateMockUser = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("coder123", salt);

  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
  };
};

export const generateMockUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateMockUser());
  }
  return users;
};
