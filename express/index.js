const http = require("http");
const url = require("url");

function createApp() {
  let app = (req, res) => {
    let reqMethod = req.method.toLowerCase();
    let { pathname } = url.parse(req.url, true);

    let index = 0;
    function next(err) {
      if (index === app.routes.length) {
        return res.end(`cannot ${reqMethod} ${pathname}`);
      }
      let { method, path, handler } = app.routes[index++];

      if (err) {
        if (handler.length === 4) {
          handler(err, req, res, next);
        } else {
          next(err);
        }
      } else {
        if (method === "middle") {
          if (
            path === "/" ||
            path === pathname ||
            pathname.startsWith(path + "/")
          ) {
            handler(req, res, next);
          } else {
            next();
          }
        } else {
          if (
            (method === reqMethod || method === "all") &&
            (path === pathname || path === "*")
          ) {
            handler(req, res);
          } else {
            next();
          }
        }
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

  app.listen = function () {
    let server = http.createServer(app);
    server.listen(...arguments);
  };

  return app;
}

module.exports = createApp;
