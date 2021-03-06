const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

function createApp() {
  staticPath = "public";

  let app = (req, res) => {
    let reqMethod = req.method.toLowerCase();
    let { pathname } = url.parse(req.url, true);

    initStatic(pathname, res);

    let index = 0;

    let exeErrMiddle = (err, handler) => {
      if (handler.length === 4) {
        handler(err, req, res, next);
      } else {
        next(err);
      }
    };

    let exeMiddle = (path, handler) => {
      if (
        path === "/" ||
        path === pathname ||
        pathname.startsWith(path + "/")
      ) {
        handler(req, res, next);
      } else {
        next();
      }
    };

    let exeRoute = (method, path, handler) => {
      if (
        (method === reqMethod || method === "all") &&
        (path === pathname || path === "*")
      ) {
        handler(req, res);
      } else {
        next();
      }
    };

    function next(err) {
      if (index === app.routes.length) {
        return res.end(`cannot ${reqMethod} ${pathname}`);
      }
      let { method, path, handler } = app.routes[index++];

      if (err) {
        exeErrMiddle(err, handler);
      } else if (method === "middle") {
        exeMiddle(path, handler);
      } else {
        exeRoute(method, path, handler);
      }
    }

    next();
  };

  app.routes = [];

  app.use = (path, handler) => {
    if (typeof handler !== "function") {
      handler = path;
      path = "/";
    }
    let layer = {
      method: "middle",
      path,
      handler,
    };
    app.routes.push(layer);
  };

  app.use((req, res, next) => {
    let { pathname, query } = url.parse(req.url, true);
    let hostname = req.headers["host"].split(":")[0];
    req.pathname = pathname;
    req.hostname = hostname;
    req.query = query;
    next();
  });

  app.use((req, res, next) => {
    let postDate = "";
    req.on("data", (chunk) => {
      postDate += chunk;
    });

    req.on("end", () => {
      console.log(postDate);
    });
    next();
  });

  app.all = (path, handler) => {
    let layer = {
      method: "all",
      path,
      handler,
    };
    app.routes.push(layer);
  };

  http.METHODS.forEach((method) => {
    method = method.toLowerCase();
    app[method] = function (path, handler) {
      let layer = {
        method,
        path,
        handler,
      };
      app.routes.push(layer);
    };
  });

  function getFileMime(extname) {
    var data = fs.readFileSync("./data/mime.json");
    let mimeObj = JSON.parse(data.toString());
    return mimeObj[extname];
  }

  initStatic = function (pathname, res) {
    pathname = pathname === "/" ? "/index.html" : pathname;
    let extname = path.extname(pathname);

    if (pathname != "/favicon.ico") {
      try {
        let data = fs.readFileSync("./" + staticPath + pathname);
        if (data) {
          let mime = getFileMime(extname);
          res.writeHead(200, {
            "Content-Type": "" + mime + ';charset="utf-8"',
          });
          res.end(data);
        }
      } catch (error) {}
    }
  };

  app.static = (reqPath) => {
    staticPath = reqPath;
  };

  app.listen = function () {
    let server = http.createServer(app);
    server.listen(...arguments);
  };

  return app;
}

module.exports = createApp;
