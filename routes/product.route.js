const express = require("express");
const router = express.Router();

const {
  addNewProduct,
  editProduct,
  deletedProduct,
} = require('../controllers/stockControllers')

router.post("/", addNewProduct);

router.put("/:id", editProduct);

router.delete("/:id", deletedProduct);

module.exports = router;