const express = require('express')
const router = express.Router()

const {
  addNewEmployee,
  editEmployee,
  deletedEmployee,
  createTask,
} = require('../controllers/employeeControler')

router.post('/employees', addNewEmployee); 
router.put('/employees/:id', editEmployee);
router.delete('/employees/:id', deletedEmployee);
router.post('/tasks', createTask);

module.exports = router;