import { checkSchema, validationResult } from "express-validator"
import createError from "http-errors"
import { findProductBySKU } from "../../lib/db/products.js"

const productsSchema = {
  description: {
    isString: {
      errorMessage: "Description field cannot be empty",
    },
  },
  name: {
    isString: {
      errorMessage: "Name field cannot be empty",
    },
  },
  brand: {
    isString: {
      errorMessage: "Brand field cannot be empty",
    },
  },
  price: {
    isNumeric: {
      errorMessage: "Price field cannot be empty",
    },
  },
  category: {
    isIn: {
      options: [["smartphone", "tablet", "computer"]],
      errorMessage: "Category must be either smartphone, tablet or computer",
    },
  },
  sku: {
    custom: {
      options: async value => {
        try {
          const product = await findProductBySKU(value)
          if (product) return Promise.reject("SKU already in use")
          else return product
        } catch (error) {
          console.log(error)
        }
      },
    },
  },
}

const productsUpdateSchema = {
  description: {
    isString: {
      errorMessage: "Description field cannot be empty",
    },
    optional: true,
  },
  name: {
    isString: {
      errorMessage: "Name field cannot be empty",
    },
    optional: true,
  },
  brand: {
    isString: {
      errorMessage: "Brand field cannot be empty",
    },
    optional: true,
  },
  price: {
    isNumeric: {
      errorMessage: "Price field cannot be empty",
    },
    optional: true,
  },
  category: {
    isIn: {
      options: [["smartphone", "tablet", "computer"]],
      errorMessage: "Category must be either smartphone, tablet or computer",
    },
    optional: true,
  },
  // TODO: add sku async validation (sku needs to be unique)
}

export const checksProductsSchema = checkSchema(productsSchema)

export const checksUpdateProductsSchema = checkSchema(productsUpdateSchema)

export const checksValidationResult = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    next(createError(400, `Validation errors!`, { errorsList: errors.array() }))
  } else {
    // no errors
    next()
  }
}
