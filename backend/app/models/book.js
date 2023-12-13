const mongoose = require("mongoose");
const { raiting, genreList } = require("../const");

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    authors: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
      required: true,
    },
    genre: {
      type: String,
      enum: genreList,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      enum: raiting,
      default: 1,
    },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    dueDate: Date,
    borrowHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        borrowedDate: Date,
        returnedDate: Date,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { toObject: { getters: true } }
);

module.exports = mongoose.model("books", BookSchema);
