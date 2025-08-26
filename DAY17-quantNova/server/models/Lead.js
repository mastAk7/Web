import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    investorType: { type: String, enum: ["Institution", "HNWI/Family Office", "NRI/Foreign", "Other"], default: "Other" },
    message: { type: String },
    requestPitchDeck: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
