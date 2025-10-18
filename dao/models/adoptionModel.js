import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema({
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pets",
    required: true,
    unique: true,
  },
  adoptionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "adopted", "cancelled"],
    default: "adopted",
  },
});
adoptionSchema.pre("find", function () {
  this.populate("adopter").populate("pet");
});

const adoptionModel = mongoose.model("adoptions", adoptionSchema);

export default adoptionModel;
