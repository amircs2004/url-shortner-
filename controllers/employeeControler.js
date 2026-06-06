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
  // 1. Only pull out userId to use for finding the document
  const { userId, ...updateData } = req.body;

  // 2. Validate that the userId exists
  if (!userId) {
    return res.status(400).json({ message: "PLS PROVIDE USER ID" });
  }

  // 3. Ensure they sent at least something to update (like username, email, etc.)
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide at least one field to update" });
  }

  try {
    // 4. Update MongoDB with the remaining fields inside updateData
    const updatedEmployee = await user.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true, 
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ // Changed to 200 OK since 201 is usually for creating
      success: true,
      data: updatedEmployee,
    });
  } catch (error) {
    console.error(error); // Always log this so you can see it in Vercel if it fails!
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
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
const getAllTasks = async (req , res) =>{

}
const employeeTest = async (req , res)=>{
    return res.send('employee scaling is working fine')
}
module.exports = {
  addNewEmployee,
  editEmployee,
  deletedEmployee,
  createTask, 
  getAllTasks ,
  employeeTest
};
