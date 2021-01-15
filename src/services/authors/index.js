const express = require("express")

const AuthorsSchema = require("./schema")

const authorsRouter = express.Router()

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorsSchema.find({})
    res.send(authors)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const author = await AuthorsSchema.findById(id)
    if (author) {
      res.send(author)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("A problem occurred!")
  }
})

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthors = new AuthorsSchema(req.body)
    const { _id } = await newAuthors.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const author = await AuthorsSchema.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (author) {
      res.send(author)
    } else {
      const error = new Error(`Author with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const author = await AuthorsSchema.findByIdAndDelete(req.params.id)
    if (author) {
      res.send("Deleted")
    } else {
      const error = new Error(`Author with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = authorsRouter