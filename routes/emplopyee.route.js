const express = require('express')
const router = express.Router()

const {
  addNewEmployee,
  editEmployee,
  deletedEmployee,
  createTask, 
  getAllTasks , 
  employeeTest
} = require('../controllers/employeeControler')

router.post('/', addNewEmployee); 
router.put('/:id', editEmployee);
router.delete('/:id', deletedEmployee);
router.post('/tasks', createTask);
router.get('/tasks' , getAllTasks)
router.get('/employee-test' , employeeTest)

module.exports = router;