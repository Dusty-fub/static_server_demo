const express = require("./express");

let app = express();

app.use("/", (req, res, next) => {
  console.log("执行中间件");
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  next();
});

app.get("/", (req, res) => {
  res.end("服务");
});

app.post("/", (req, res) => {
  res.end("post name");
});

app.all("*", (req, res) => {
  res.end("all");
});

app.listen(3000, () => {
  console.log("server start at http://localhost:3000");
});
