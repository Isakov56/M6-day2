const express = require("express")
const mongoose = require("mongoose")

const ArticlesSchema = require("./schema")
const ReviewsSchema = require("../reviews/schema")

const articlesRouter = express.Router()

articlesRouter.get("/", async (req, res, next) => {
  try {
    const articles = await ArticlesSchema.find()
    res.send(articles)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const article = await ArticlesSchema.findById(id)
    if (article) {
      res.send(article)
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

articlesRouter.post("/", async (req, res, next) => {
  try {
    const newArticles = new ArticlesSchema(req.body)
    const { _id } = await newArticles.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

articlesRouter.put("/:id", async (req, res, next) => {
  try {
    const article = await ArticlesSchema.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (article) {
      res.send(article)
    } else {
      const error = new Error(`Article with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const article = await ArticlesSchema.findByIdAndDelete(req.params.id)
    if (article) {
      res.send("Deleted")
    } else {
      const error = new Error(`article with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

articlesRouter.post("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
   
     // FIND ARTICLE WITH ID  * 
    const article = await  ArticlesSchema.findById(req.params.id)
    if(article){
      // FIND REVIEW INDEX IN ARRAY

      const reviewIndex =article.reviews.findIndex((review)=>review._id.toString()===req.params.reviewId)
      if(reviewIndex!==-1){
        //  // GRAB  REVIEW WITH INDEX 
        const review = article.reviews[reviewIndex];
        //  REPLACE UPDATED REVIEW WITH INDEX
         article.reviews[reviewIndex] = {...review._doc,...req.body}
         // UPDATE ARTICLE
         await article.update({reviews:article.reviews})
         
         res.send(article)
      }
      else{
        // review not found
        res.status(404).send("not found")
      }
    }
    else{
      //  article not found
      res.status(404).send("not found")
    }
  } catch (error) {
    next(error)
  }
})

articlesRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const articleId = req.params.id
    const { reviews } = await ArticlesSchema.findById(articleId, {reviews: 1, _id: 0})
    console.log(reviews)
    res.send(reviews)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.get("/:id/reviews/:reviewId", async (req, res, next) =>{
    try {
      const articleId = req.params.id
      const reviewId = req.params.reviewId

      const {reviews} = await ArticlesSchema.findOne(
        {_id: mongoose.Types.ObjectId(articleId)},
        {
          reviews: {
            $elemMatch: {
              _id: mongoose.Types.ObjectId(reviewId)
            }
          }
        }
      )
      res.send(reviews[0])
    } catch (error) {
      next(error)
    }
})

articlesRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const articleId = req.params.id
    const reviewId = req.params.reviewId

    const {reviews} = await ArticlesSchema.findOne(
      {_id: mongoose.Types.ObjectId(articleId)},
      {
        reviews: {
          $elemMatch: {_id: mongoose.Types.ObjectId(reviewId)}
        }
      }
    )

    const oldReviews = reviews[0].toObject()
    const modifiedReview = {...oldReviews, ...req.body}

    await ArticlesSchema.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(articleId),
        "reviews._id": mongoose.Types.ObjectId(reviewId)
      },
      {
        $set: {"reviews.$": modifiedReview}
      }
    )
    res.send("Went find")
  } catch (error) {
    console.log("did not went find")
    next(error)
  }
})

articlesRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedArticle = await ArticlesSchema.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id)
      },
      {
        $pull: {reviews: {_id: mongoose.Types.ObjectId(req.params.reviewId)}}
      },
      {runValidators: true, new: true}
    )
    res.send(modifiedArticle)
  } catch (error) {
    
  }
})
module.exports = articlesRouter
