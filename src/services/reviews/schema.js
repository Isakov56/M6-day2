const {Schema } = require("mongoose")
const mongoose = require("mongoose")

const ReviewsSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
          },
        user: {
            type: String, 
            required: true
        }
    }
)

module.exports = mongoose.model("Reviews", ReviewsSchema)