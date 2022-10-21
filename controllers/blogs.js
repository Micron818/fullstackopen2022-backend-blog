const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

//get all
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

//get by id
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) response.json(blog);
  else response.status(404).end();
});

//create
blogsRouter.post("/", async (request, response) => {
  const user = await User.findById(request.user.id);
  const blog = new Blog({ ...request.body, user: user.id });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

//delete
blogsRouter.delete("/:id", async (request, response) => {
  const user = await User.findById(request.user.id);
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(400).json({ error: "invlid blog id" });

  if (user.id !== blog.user.toString())
    return response
      .status(400)
      .json({ error: "logined user and blog id is different" });

  const removedBlog = await Blog.remove(blog);

  user.blogs = user.blogs.filter((blog) => blog.id === removedBlog.id);
  await user.save();

  response.status(201).json(removedBlog);
});

//update
blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
    }
  );

  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
