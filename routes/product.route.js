const express = require("express");
const router = express.Router();

const {
  addNewProduct,
  editProduct,
  deletedProduct,
  searchProductById
} = require('../controllers/productController')

router.post("/", addNewProduct);

router.put("/:id", editProduct);

router.get('/:id' , searchProductById) // Assuming you have a function to handle this in your controller
router.delete("/:id", deletedProduct);

module.exports = router;