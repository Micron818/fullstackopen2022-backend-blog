const object = {
  _id: "5a422bc61b54a676234d17fc",
  title: "Type wars",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  likes: 2,
  __v: 0,
};
const picked = ({ title, author, likes }) => {
  return { title, author, likes };
};

// console.log(picked(object));

const obj = {};
const p1="test";
obj.p1 = 1;
obj[p1]=2;``
console.log(obj)
console.log(Object.entries(obj));
