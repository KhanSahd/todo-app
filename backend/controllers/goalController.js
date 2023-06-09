const asyncHandler = require("express-async-handler"); // Had to install using npm. This is used to handle the async error
//  handler for us instead of using .then or try/catch. After this we can now use the mangoDB

const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// @desc    GET goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });

  res.status(200).json(goals);
});

// @desc    SET goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("please add a text field");
  }

  const goal = await Goal.create({
    text: req.body.text,
    completed: false,
    user: req.user.id,
  });

  res.status(200).json(goal);
});

// @desc    UPDATE goal
// @route   PUT /api/goals:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  // });

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the logged in user matches the owner of the goal
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(
    req.params.id,
    { completed: !goal.completed },
    { new: true }
  );

  // goal.completed = !goal.completed;

  res.status(200).json(updatedGoal);
});

// @desc    DELETE goal
// @route   DELETE /api/goals:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the logged in user matches the owner of the goal
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(
    req.params.id,
    { completed: !goal.completed },
    { new: true }
  );

  await Goal.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
