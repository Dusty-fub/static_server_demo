const express = require("./express");

let app = express();

app.use("/", (req, res, next) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  console.log(req.hostname);
  console.log(req.pathname);
  console.log({ ...req.query });
  next("middle error msg");
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

app.use((err, req, res, next) => {
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(3000, () => {
  console.log("server start at http://localhost:3000");
});
