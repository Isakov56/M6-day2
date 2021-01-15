const express = require("express")

const ReviewsSchema = require("./schema")

const reviewsRouter = express.Router()

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewsSchema.find({})
    console.log(reviews)
    res.send(reviews)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const review = await ReviewsSchema.findById(id)
    if (review) {
      res.send(review)
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

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReviews = new ReviewsSchema(req.body)
    const { _id } = await newReviews.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.put("/:id", async (req, res, next) => {
  try {
    const review = await ReviewsSchema.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (review) {
      res.send(review)
    } else {
      const error = new Error(`Review with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const review = await ReviewsSchema.findByIdAndDelete(req.params.id)
    if (review) {
      res.send("Deleted")
    } else {
      const error = new Error(`Review with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = reviewsRouter