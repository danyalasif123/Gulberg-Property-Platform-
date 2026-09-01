import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "society",
        "block",
        "area",
      ],
      default: "area",
    },

    /*
     * =========================================
     * PARENT LOCATION
     * =========================================
     *
     * Example:
     *
     * Gulberg Residencia
     *      ↓
     *    Block A
     *
     * Block A.parentLocation
     * = Gulberg Residencia._id
     *
     * Societies have no parent.
     */

    parentLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model(
  "Location",
  locationSchema
);

export default Location;