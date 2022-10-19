const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("4.8: Blog list tests, step1, verify blogs length ", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("4.9: Blog list tests, step2, verify id defined", async () => {
  const response = await api.get("/api/blogs");
  const getId = () => response.body[0].id;
  expect(getId()).toBeDefined();
});

test("4.10: Blog list tests, step3, vefiry create", async () => {
  const newBlog = {
    title: "4.10: Blog list tests, step3, vefiry create",
    author: "test",
    likes: 10,
    url: "test",
  };

  const response = await api.post("/api/blogs").send(newBlog);
  expect(response.body).toEqual({ ...newBlog, id: response.body.id });

  const blogsInDb = await helper.blogsInDb();
  expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1);
});

test("4.11: Blog list tests, step4, default likes value 0", async () => {
  const newBlog = {
    title: "4.11: Blog list tests, step4, default likes value 0",
    author: "test",
    url: "test url",
  };

  const response = await api.post("/api/blogs").send(newBlog);
  expect(response.body.likes).toBe(0);
});

test("4.12*: Blog list tests, step5, require title and url", async () => {
  const newBlog = {};
  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("4.13 Blog list expansions, step1, delete by id", async () => {
  const blogToDelete = (await helper.blogsInDb())[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsInDb = await helper.blogsInDb();
  expect(blogsInDb).not.toContainEqual(blogToDelete);
});

test("4.14 Blog list expansions, step2, update by id", async () => {
  let blogToUpdate = (await helper.blogsInDb())[0];
  blogToUpdate = { ...blogToUpdate, likes: ++blogToUpdate.likes };
  const result = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200);
  blogToUpdate = (await helper.blogsInDb())[0];
  expect(result.body).toEqual(blogToUpdate);
});

afterAll(() => {
  mongoose.connection.close();
});
