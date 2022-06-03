import { wkrk } from ".";

test("supports to return an instance of Response", async () => {
  const index = {
    get(req, res) {
      return new Response("Hello world!");
    },
  };
  const routes = { "/": index };

  let req = new Request("https://worker.example.com");
  const handler = wkrk(routes);
  let res = await handler.fetch(req);
  let body = await res.text();
  expect(res.headers.get("content-type")).toEqual("text/plain;charset=UTF-8");
  expect(body).toEqual("Hello world!");
});

test("supports to return an instance of Response", async () => {
  const index = {
    get(req, res) {
      return new Response("Hello world!");
    },
  };
  const routes = { "/": index };

  let req = new Request("https://worker.example.com");
  const handler = wkrk(routes);
  let res = await handler.fetch(req);
  let body = await res.text();
  expect(res.headers.get("content-type")).toEqual("text/plain;charset=UTF-8");
  expect(body).toEqual("Hello world!");
});

test("handles routes", async () => {
  const index = {
    get(req, res) {
      return res.send("Hello world!");
    },
  };
  const routes = { "/": index };

  let req = new Request("https://worker.example.com");
  const handler = wkrk(routes);
  let res = await handler.fetch(req);
  let body = await res.text();
  expect(res.headers.get("content-type")).toEqual("text/html;charset=UTF-8");
  expect(body).toEqual("Hello world!");
});

test("handles a default route that handles all request methods", async () => {
  const index = {
    handler(req, res) {
      return res.send("Hello world!");
    },
  };
  const routes = { "/": index };

  let req = new Request("https://worker.example.com", { method: "POST" });
  const handler = wkrk(routes);

  let res = await handler.fetch(req);
  expect(res.status).toEqual(200);

  res = await handler.fetch(req);
  expect(res.status).toEqual(200);

  req = new Request("https://worker.example.com", { method: "PUT" });
  res = await handler.fetch(req);
  expect(res.status).toEqual(500);
  expect(await res.text()).toEqual("Unknown request method: PUT");
});

test("returns an error if the provided request method doesn't exist", async () => {
  const index = {};
  const routes = { "/": index };

  let req = new Request("https://worker.example.com", { method: "PUT" });
  const handler = wkrk(routes);

  const res = await handler.fetch(req);
  expect(res.status).toEqual(500);
  expect(await res.text()).toEqual("Unknown request method: PUT");
});

test.skip("returns an error in json format if the provided request method doesn't exist and the request method is json", async () => {
  const index = {};
  const routes = { "/": index };

  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  let req = new Request("https://worker.example.com", {
    headers,
    method: "PUT",
  });
  const handler = wkrk(routes);

  const res = await handler.fetch(req);
  expect(res.status).toEqual(500);
  expect(await res.json()).toEqual({ error: "Unknown request method: PUT" });
});

test("returns json", async () => {
  const index = {
    get(req, res) {
      return res.json({ hello: "world" });
    },
  };
  const routes = { "/": index };

  let req = new Request("https://worker.example.com");
  const handler = wkrk(routes);
  let res = await handler.fetch(req);

  expect(res.headers.get("content-type")).toEqual("application/json");

  let body = await res.json();
  expect(body).toEqual({ hello: "world" });
});

test("handles post requests", async () => {
  const index = {
    post(req, res) {
      return res.json({ hello: "world" });
    },
  };
  const routes = { "/": index };

  let req = new Request("https://worker.example.com", { method: "POST" });
  const handler = wkrk(routes);
  let res = await handler.fetch(req);
  let body = await res.json();
  expect(body).toEqual({ hello: "world" });
});

test("returns an error if a route doesn't exist", async () => {
  const routes = {};
  let req = new Request("https://worker.example.com", { method: "POST" });
  const handler = wkrk(routes);
  let res = await handler.fetch(req);
  let body = await res.text();
  expect(res.status).toEqual(500);
  expect(body).toEqual(
    "Don't know how to handle the / path. Check your routes configuration."
  );
});

//test("allows to redirect", async () => {
//const index = {
//get(req, res) {
//return res.redirect("https://giovannibenussi.com");
//},
//};
//const routes = { "/": index };

//let req = new Request("https://worker.example.com");
//const handler = wkrk(routes);
//let res = await handler.fetch(req);
//let body = await res.text();
//expect(res.status).toEqual(307);
//expect(res.headers.get("location")).toEqual("https://giovannibenussi.com");
//});

//test("allows to redirect specifying a custom status code", async () => {
//const index = {
//get(req, res) {
//return res.redirect(301, "https://giovannibenussi.com");
//},
//};
//const routes = { "/": index };

//let req = new Request("https://worker.example.com");
//const handler = wkrk(routes);
//let res = await handler.fetch(req);
//let body = await res.text();
//expect(res.status).toEqual(301);
//expect(res.headers.get("location")).toEqual("https://giovannibenussi.com");
//});
