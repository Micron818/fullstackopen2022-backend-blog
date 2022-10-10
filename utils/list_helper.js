const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((total, item) => total + item.likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((blog, item) =>
    blog.likes > item.likes ? blog : item
  );

  const pickBlog = ({ title, author, likes }) => ({ title, author, likes });

  return pickBlog(blog);
};

const mostBlogs = (blogs) => {
  const authorCounter = {};
  blogs.forEach((blog) =>
    authorCounter[blog.author]
      ? authorCounter[blog.author]++
      : (authorCounter[blog.author] = 1)
  );

  const maxCount = Math.max(...Object.values(authorCounter));

  const mostBlogsArr = Object.entries(authorCounter).filter(
    ([author, blogs]) => blogs === maxCount
  );

  const mostBlogs = { author: mostBlogsArr[0][0], blogs: mostBlogsArr[0][1] };
  return mostBlogs;
};

const mostLikes = (blogs) => {
  const authorLikes = {};
  blogs.forEach((blog) =>
    authorLikes[blog.author]
      ? (authorLikes[blog.author] += blog.likes)
      : (authorLikes[blog.author] = blog.likes)
  );
  const maxLikes = Math.max(...Object.values(authorLikes));

  const mostLikesArr = Object.entries(authorLikes).filter(
    ([author, likes]) => likes === maxLikes
  );

  const mostLikes = { author: mostLikesArr[0][0], likes: mostLikesArr[0][1] };
  return mostLikes;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
