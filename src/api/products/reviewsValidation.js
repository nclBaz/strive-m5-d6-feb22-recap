import { checkSchema } from "express-validator"

const newReviewSchema = {
  comment: {
    isString: {
      errorMessage: "Comment field cannot be empty",
    },
  },
  rate: {
    isInt: {
      options: {
        min: 1,
        max: 5,
      },
      errorMessage: "Rate must be an integer number between 1 and 5",
    },
  },
}

const updateReviewSchema = {
  comment: {
    isString: {
      errorMessage: "Comment field cannot be empty",
    },
    optional: true,
  },
  rate: {
    isInt: {
      options: {
        min: 1,
        max: 5,
      },
      errorMessage: "Rate must be an integer number between 1 and 5",
    },
    optional: true,
  },
}

export const checkNewReviewSchema = checkSchema(newReviewSchema)
export const checkUpdatedReviewSchema = checkSchema(updateReviewSchema)
