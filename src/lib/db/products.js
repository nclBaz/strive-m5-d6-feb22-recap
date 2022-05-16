import createError from "http-errors"
import uniqid from "uniqid"
import { getProducts, writeProducts } from "../fs/tools.js"

export const saveNewProduct = async newProductData => {
  const newProduct = { ...newProductData, createdAt: new Date(), id: uniqid(), reviews: [] }

  const products = await getProducts()
  products.push(newProduct)
  await writeProducts(products)

  return newProduct.id
}

export const findProducts = () => getProducts()

export const findProductById = async productId => {
  const products = await getProducts()

  const foundProduct = products.find(product => product.id === productId)

  if (foundProduct) return foundProduct
  else throw createError(404, `Product with id ${productId} not found!`)
}

export const findProductBySKU = async sku => {
  const products = await getProducts()

  const foundProduct = products.find(product => product.sku === sku)

  if (foundProduct) return foundProduct
  else throw createError(404, `Product with id ${sku} not found!`)
}

export const findProductByIdAndUpdate = async (productId, updates) => {
  const products = await getProducts()

  const index = products.findIndex(product => product.id === productId)

  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date() }
    await writeProducts(products)

    return products[index]
  } else {
    throw createError(404, `Product with id ${productId} not found!`)
  }
}

export const findProductByIdAndDelete = async productId => {
  const products = await getProducts()

  const remainingProducts = products.filter(product => product.id !== productId)

  if (products.length === remainingProducts.length) throw createError(404, `Product with id ${productId} not found!`)

  await writeProducts(remainingProducts)
}
