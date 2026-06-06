const user = require("../models/user");
const task = require('../models/task')
const mongoose = require("mongoose");

const addNewEmployee = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ Message: "PLS PROVIDE USER DETAILS" });
  }
  try {
    const newEmployee = await user.create({
      username: username,
      email: email,
      password: password,
      role: role,
    });
    return res.status(201).json({
      sucess: true,
      data: newEmployee,
      message: "employee created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Message: "SOMETHING WENT WRONG" });
  }
};
const editEmployee = async (req, res) => {
  const { userId, username } = req.body;
  if (!userId || !username) {
    return res.status(400).json({ Message: "PLS PROVIDE USER DETAILS" });
  }

  //  const newData = req.body;
  const { ...updateData } = req.body;
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide at least one field to update" });
  }
  try {
    /*
    const foundEmployeeAndEdited = await user.findByIdAndUpdate({
      data: newData,
      changed: true,
    });
    */
       const updatedEmployee = await user.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // FIX: corrected spelling
    });
    return res.status(201).json({
      sucess: true,
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ Message: "SOMETHING WENT WRONG" });
  }
};

const deletedEmployee = async (req, res) => {
 
 //   const { userId, username } = req.body;
 const { id } = req.params;
  if (!id) {
    return res.status(400).json({ Message: "PLS PROVIDE USER DETAILS" });
  }

  try {
    const deletedEmployee = await user.findByIdAndDelete(id);
      if (!deletedEmployee) {
        return res
          .status(404)
          .json({ success:- false, message: "Employee not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
        data: deletedEmployee, //
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Something went wrong during deletion" });
    }
  }



const createTask = async (req, res) => {
    const { title, description, assignedTo } = req.body;

    if (!title || !assignedTo) {
        return res.status(400).json({ message: "Title and assigned employee are required" });
    }

    try {
        const newTask = await task.create({
            title,
            description,
            assignedTo
        });
        return res.status(201).json({
            success: true,
            data: newTask,
            message: "Task created successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong during task creation" });
    }
};

module.exports = {
  addNewEmployee,
  editEmployee,
  deletedEmployee,
  createTask,
};
