// import mongoose from "mongoose";
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: [true, "USER_ID MUST HAVE A NUMBER"],
    unique: true,
    // trim: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  lenOfBatches: {
    type: Number,
    default: 0,
  },
  batches: [
    {
      blocks: [
        {
          index: {
            type: Number,
            required: [true, "index must have a number"],
          },
          category: {
            type: String,
            required: [true, "Category MUST HAVE A STRING"],
          },
          free: {
            type: Boolean,
            required: [true, "FREE MUST HAVE A BOOLEAN VALUE"],
          },
          fees: {
            type: Number,
            required: [true, "FREE MUST HAVE A NUMBER"],
          },
          isDone: {
            type: Boolean,
            default: false,
          },
          date: {
            type: Date,
            default: new Date(),
          },
        },
      ],
    },
  ],
});

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;
