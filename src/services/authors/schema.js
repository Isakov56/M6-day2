const {Schema } = require("mongoose")
const mongoose = require("mongoose")

const AuthorsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
          },
        surname: {
            type: String, 
            required: true
        }
    }
)

module.exports = mongoose.model("Authors", AuthorsSchema)