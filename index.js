const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
require("dotenv").config();
const posts = [
  {
    name: "richard",
    age: "100",
    phone: "123456",
  },
  { name: "janet", age: "100", phone: "654321" },
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.access_token, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.post("/login", (req, res) => {
  //user authentication
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.access_token);

  res.json({ accessToken: accessToken });
});

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter(post=> post.name === req.user.name));
});

app.listen(5000, () => {
  console.log("Hey we are listening on port 5000");
});
