const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");

const User = require("../models/user");

// jest.setTimeout(1000000);

describe("4.16,bloglist expansion,user CRUD", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

  test("verify initial user created", async () => {
    const newUser = {
      username: "test4.15",
      name: "test4.15",
      password: "test",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersInDb = await helper.usersInDb();
    expect(usersInDb).toHaveLength(helper.initialUsers.length + 1);
  });

  test("creating fails if username length less 3", async () => {
    const newUser = {
      username: "t4",
      name: "test4.16",
      password: "ps",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toEqual("username length must be at least 3");
  });

  test("creating fails if password length less 3", async () => {
    const newUser = {
      username: "test4.16",
      name: "test4.16",
      password: "ps",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toEqual("password length must be at least 3");
  });

  test("creating fails if username already taken ", async () => {
    const newUser = {
      username: "hellas",
      name: "Arto Hellas",
      password: "hellas.password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toEqual("username must be unique");
  });
});

describe("4.23,bloglist expansion, blog CRUD", () => {
  let token, user;
  beforeEach(async () => {
    await User.deleteMany();
    await User.insertMany(helper.initialUsers);

    await Blog.deleteMany();
    await Blog.insertMany(helper.initialBlogs);

    user = {
      username: "hellas",
      name: "Arto Hellas",
      password: "hellas",
    };
    const loginUser = await api.post("/login").send(user).expect(200);
    token = loginUser.body.token;
  });

  test("add blog with token successfully", async () => {
    const newBlog = {
      title: "add new blog success",
      author: user.username,
      url: "https://reactpatterns.com/",
    };

    const addedBlog = await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlog)
      .expect(201);

    expect(addedBlog.body.likes).toBe(0);

    user = await User.findById(addedBlog.body.user);
    expect(user.blogs.toString()).toMatch(addedBlog.body.id);
  });

  test("add blog miss token failed response 401", async () => {
    const newBlog = {
      title: "add new blog fail",
      author: user.username,
      url: "https://reactpatterns.com/",
      likes: 7,
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(401);
    expect(response.body.error).toBe(
      "Unauthorized:missing authorization token in Header"
    );
  });

  test("add blog require title and url", async () => {
    const newBlog = {};
    await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlog)
      .expect(400);
  });

  test("delete blog", async () => {
    const blogToDelete = (await helper.blogsInDb())[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", token)
      .expect(201);

    const blogsInDb = await helper.blogsInDb();
    expect(blogsInDb).not.toContainEqual(blogToDelete);
  });

  test("update blog", async () => {
    let blogToUpdate = (await helper.blogsInDb())[0];
    blogToUpdate = { ...blogToUpdate, likes: ++blogToUpdate.likes };
    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", token)
      .send(blogToUpdate)
      .expect(201);
    blogToUpdate = (await helper.blogsInDb())[0];
    expect(JSON.stringify(result.body)).toEqual(JSON.stringify(blogToUpdate));
  });
});

afterAll(() => {
  mongoose.connection.close();
});
