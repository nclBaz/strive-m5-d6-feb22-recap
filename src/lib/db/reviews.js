import createError from "http-errors"
import uniqid from "uniqid"
import { getProducts, writeProducts } from "../fs/tools.js"
import { findProductById } from "./products.js"

export const saveNewReview = async (productId, newReviewData) => {
  const products = await getProducts()

  const productIndex = products.findIndex(product => product.id === productId)
  if (productIndex !== -1) {
    products[productIndex].reviews.push({
      ...newReviewData,
      id: uniqid(),
      createdAt: new Date(),
    })

    await writeProducts(products)
    return products[productIndex]
  } else {
    throw createError(404, `Product with id ${productId} not found!`)
  }
}

export const findReviewById = async (productId, reviewId) => {
  const { reviews } = await findProductById(productId)

  const foundReview = reviews.find(review => review.id === reviewId)

  if (foundReview) return foundReview
  else throw createError(404, `Review with id ${reviewId} not found!`)
}

export const findReviewByIdAndUpdate = async (productId, reviewId, updates) => {
  const products = await getProducts()

  const productIndex = products.findIndex(product => product.id === productId)
  if (productIndex !== -1) {
    const reviewIndex = products[productIndex].reviews.findIndex(review => review.id === reviewId)

    if (reviewIndex !== -1) {
      products[productIndex].reviews[reviewIndex] = {
        ...products[productIndex].reviews[reviewIndex],
        ...updates,
        updatedAt: new Date(),
      }

      await writeProducts(products)

      return products[productIndex].reviews[reviewIndex]
    } else {
      throw createError(404, `Review with id ${reviewId} not found!`)
    }
  } else {
    throw createError(404, `Product with id ${productId} not found!`)
  }
}

export const findReviewByIdAndDelete = async (productId, reviewId) => {
  const products = await getProducts()

  const productIndex = products.findIndex(product => product.id === productId)
  if (productIndex !== -1) {
    const lengthBefore = products[productIndex].reviews.length

    products[productIndex].reviews = products[productIndex].reviews.filter(review => review.id !== reviewId)

    if (lengthBefore === products[productIndex].reviews.length) throw createError(404, `Review with id ${reviewId} not found!`)
    await writeProducts(products)

    return products[productIndex].reviews
  } else {
    throw createError(404, `Product with id ${productId} not found!`)
  }
}
