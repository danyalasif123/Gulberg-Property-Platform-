import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },

    propertyType: {
      type: String,
      required: true,
      enum: [
        "plot",
        "house",
        "apartment",
        "farmhouse",
        "commercial"
      ]
    },

    purpose: {
      type: String,
      required: true,
      enum: ["sale", "rent"]
    },

   category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true,
},

    society: {
      type: String,
      required: true,
      trim: true
    },

    block: {
      type: String,
      trim: true
    },

    plotNumber: {
      type: String,
      trim: true
    },

    street: {
      type: String,
      trim: true
    },

    size: {
      value: {
        type: Number,
        required: true
      },

      unit: {
        type: String,
        required: true,
        enum: ["marla", "kanal", "sqft"]
      }
    },

    price: {
      amount: {
        type: Number,
        required: true
      },

      currency: {
        type: String,
        default: "PKR"
      }
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    features: [
      {
        type: String,
        trim: true
      }
    ],

    location: {
      latitude: {
        type: Number
      },

      longitude: {
        type: Number
      },

      address: {
        type: String,
        trim: true
      }
    },

    images: [
      {
        url: {
          type: String,
          required: true
        },

        publicId: {
          type: String
        },

        isPrimary: {
          type: Boolean,
          default: false
        }
      }
    ],

    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "published",
        "reserved",
        "sold",
        "rejected"
      ],
      default: "draft"
    },

    verificationStatus: {
      type: String,
      enum: [
        "pending",
        "verified",
        "rejected"
      ],
      default: "pending"
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    views: {
      type: Number,
      default: 0
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;