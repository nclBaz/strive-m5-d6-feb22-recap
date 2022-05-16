import express from "express"
import createError from "http-errors"
import multer from "multer"
import { extname } from "path"
import { saveNewProduct, findProducts, findProductById, findProductByIdAndUpdate, findProductByIdAndDelete } from "../../lib/db/products.js"
import { findReviewById, findReviewByIdAndDelete, findReviewByIdAndUpdate, saveNewReview } from "../../lib/db/reviews.js"
import { deleteProductsImages, saveProductsImages } from "../../lib/fs/tools.js"
import { checksProductsSchema, checksUpdateProductsSchema, checksValidationResult } from "./productsValidation.js"
import { checkNewReviewSchema, checkUpdatedReviewSchema } from "./reviewsValidation.js"

const productsRouter = express.Router()

productsRouter.post("/", checksProductsSchema, checksValidationResult, async (req, res, next) => {
  try {
    const id = await saveNewProduct(req.body)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await findProducts()
    if (req.query && req.query.category) {
      const filteredProducts = products.filter(prod => prod.category === req.query.category)
      res.send(filteredProducts)
    } else {
      res.send(products)
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.productId)
    res.send(product)
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", checksUpdateProductsSchema, checksValidationResult, async (req, res, next) => {
  try {
    const updatedProduct = await findProductByIdAndUpdate(req.params.productId, req.body)
    res.send(updatedProduct)
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.productId)
    await deleteProductsImages(product.imageUrl)

    await findProductByIdAndDelete(req.params.productId)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

productsRouter.post(
  "/:productId/image",
  multer({
    limits: 1 * 1024 * 1024,
    fileFilter: (req, file, next) => {
      if (file.mimetype !== "image/gif") {
        next(createError(400, "Only GIF allowed!"))
      } else {
        next(null, true)
      }
    },
  }).single("productPicture"),
  async (req, res, next) => {
    try {
      // save file in public folder (name will be something like op1k23pk123p21k3.gif)
      const fileName = req.params.productId + extname(req.file.originalname)
      await saveProductsImages(fileName, req.file.buffer)

      // update the product record with the image url
      const updatedProduct = await findProductByIdAndUpdate(req.params.productId, { imageUrl: "/img/products/" + fileName })
      res.send(updatedProduct)
    } catch (error) {
      next(error)
    }
  }
)

productsRouter.post("/:productId/reviews", checkNewReviewSchema, checksValidationResult, async (req, res, next) => {
  try {
    const updatedProduct = await saveNewReview(req.params.productId, req.body)
    res.send(updatedProduct)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviews } = await findProductById(req.params.productId)
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await findReviewById(req.params.productId, req.params.reviewId)
    res.send(review)
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId/reviews/:reviewId", checkUpdatedReviewSchema, checksValidationResult, async (req, res, next) => {
  try {
    const updatedReview = await findReviewByIdAndUpdate(req.params.productId, req.params.reviewId, req.body)
    res.send(updatedReview)
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviews = await findReviewByIdAndDelete(req.params.productId, req.params.reviewId)
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})

export default productsRouter
