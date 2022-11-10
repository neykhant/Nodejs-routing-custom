let http = require("http");
let url = require("url");
let qsy = require("querystring");

require("dotenv").config();

let responder = (req, res, params) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(params);
};

let routes = {
  GET: {
    "/": (req, res) => {
      let filePathName = __dirname + "/index.html";
      responder(req, res, filePathName);
    },
    // "/home": (req, res) => {
    //   responder(req, res, `<h1>Method Get and path /home </h1>`);
    // },
    "/index.html": (req, res) => {
      let filePathName = __dirname + "/index.html";
      responder(req, res, filePathName);
    },
    "/about.html": (req, res) => {
      let filePathName = __dirname + "/about.html";
      responder(req, res, filePathName);
    }
  },

  POST: {
    "/": (req, res) => {
      responder(req, res, `<h1>Method Post and path / </h1>`);
    },
    "/api/login": (req, res) => {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        let querys = qsy.parse(body);
        if (body.length > 1024) {
          res.writeHead(403, { "Content-type": "text/html" });
          res.end("<h1>File size greater than  over 1MB!</h1>");
        }
        console.log("Email :" + querys.email, "Password :" + querys.password);
        res.end();
      });
    }
  },
  NAR: (req, res) => {
    res.writeHead(404);
    res.end("<h1>No page not found!...</h1>");
  }
};

let start = (req, res) => {
  let reqMethod = req.method;
  let params = url.parse(req.url, true);
  // let name = params.query.name;
  // let age = params.query.age;

  // console.log("Name ", name, " Age ", age);

  let resolveRoute = routes[reqMethod][params.pathname];
  if (resolveRoute != null && resolveRoute != undefined) {
    resolveRoute(req, res);
  } else {
    routes["NAR"](req, res);
  }
};

let server = http.createServer(start);

server.listen(process.env.PORT, () => {
  console.log(`Running port ${process.env.PORT}....`);
});
