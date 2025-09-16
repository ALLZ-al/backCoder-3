import mongoose from "mongoose";

const validateObjectId = (req, res, next) => {
  const { userId, petId } = req.params;
  const idToValidate = userId || petId;

  if (!mongoose.Types.ObjectId.isValid(idToValidate)) {
    return res
      .status(400)
      .json({ message: `El ID (${idToValidate}) no es un ObjectId válido.` });
  }
  next();
};

export default validateObjectId;
