import validateObjectId from "../middlewares/validateObjectId.js";
import mongoose from "mongoose";

describe("Tests Unitarios para validateObjectId Middleware", () => {
  let req;
  let res;
  let next;
  const validId = new mongoose.Types.ObjectId().toHexString();
  const invalidId = "not_a_valid_id";

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };
    next = jest.fn();
  });

  it("Debería llamar a next() si se proporciona un userId válido", () => {
    req.params.userId = validId;
    validateObjectId(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("Debería devolver 400 si se proporciona un petId inválido", () => {
    req.params.petId = invalidId;
    validateObjectId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("Debería llamar a next() si se proporciona un adoptionId válido", () => {
    req.params.adoptionId = validId;
    validateObjectId(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
