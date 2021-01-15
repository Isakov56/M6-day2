const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ArticlesSchema = new Schema(
  {
    headLine: {
      type: String,
      required: true,
    },
    subHead: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      name: String,
      img: String,
    },
    author: {
      name: String,
      img: String
    },
    cover: {
      type: String
    },
    reviews: [
      {
        text: String,
        user: String,
        date: Date
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("Articles", ArticlesSchema)
