const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

//get all
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

//get by id
usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) response.json(user);
  else response.status(404).end();
});

//create
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (username.length < 3)
    return response
      .status(400)
      .json({ error: "username length must be at least 3" });

  if (password.length < 3)
    return response
      .status(400)
      .json({ error: "password length must be at least 3" });

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return response.status(400).json({ error: "username must be unique" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, passwordHash });
  const result = await user.save();
  response.status(201).json(result);
});

//delete
usersRouter.delete("/:id", async (request, response) => {
  await User.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

//modify
usersRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const user = {
    username: body.username,
    name: body.name,
  };

  const updatedUser = await User.findByIdAndUpdate(request.params.id, user, {
    new: true,
  });

  response.json(updatedUser);
});

module.exports = usersRouter;
