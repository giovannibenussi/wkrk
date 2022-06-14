<h1 align="center">wkrk</h1>

<p align="center" width="100%">
  <a href="https://badge.fury.io/js/wkrk"><img src="https://badge.fury.io/js/wkrk.svg" alt="npm version" height="18"></a>
</p>

<p align="center">
    Fast and lightweight framework for <a target='_blank' rel='noopener noreferrer' href='https://developers.cloudflare.com/workers/'>Cloudflare Workers</a>
</p>

## 👩‍🚒 Features
* Simple routing system.
* Handy helpers that return native `Request` and `Response` objects for maximum compatibility.
* TypeScript support.
* No build tools.

## Installation

npm:
`npm i wkrk`

yarn:
`yarn add wkrk`

## Getting Started

To get started, simply export a call to the `wkrk` function with your routes. Let's start with a route that responds to the /users path:

```js
// index.js
import { wkrk } from "wkrk";
import users from "./api/users";

const routes = { "/users": users };

export default wkrk(routes);
```

Then define a simple handler for `GET` requests:

```js
// api/users.js
export default {
  get(req, res) {
    return res.status(200).json({ name: "Giovanni" });
  }
};
```

You can also define everything in a single file:

```js
import { wkrk } from 'wkrk'

const routes = {
  '/users': {
    get(req, res) {
      return res.status(200).json({ name: 'Giovanni' })
    },
  },
}

export default wkrk(routes)
```

Although working on a single file works, we highly recommend to separate your routes into multiple files and join them in your main index file:

```js
import { wkrk } from 'wkrk'
import users from './api/users'
import posts from './api/posts'

const routes = {
  '/users': users,
  '/posts': posts,
}

export default wkrk(routes)
```

## Handling HTTP Methods

You can add the following functions to your routes:

- `get`: Handles `GET` requests.
- `post`: Handles `POST` requests.
- `put`: Handles `PUT` requests.
- `delete`: Handles `DELETE` requests.
- `handler`: Handles all requests that aren't defined by any function above.

You can combine handler with the other functions.  An example of this is shown below:

```js
export default {
  get(req, res) {
    return res.status(200).json({ name: "Giovanni" });
  },
  handler(req, res) {
    return res.status(200).send('I match everything except GET requests.');
  }
};
```

## Extensions

Every handler has two parameters: `req` and `res`. `res` provides handy methods that returns a native `Request` object that your Workers already understand.


```js
res.json({ name: "Giovanni" })
res.status(200).json({ name: "Giovanni" })
res.status(200).send('I return some plain text')

// Set the content type to text/html and return some data
res.set('Content-Type', 'text/html')
res.send('<p>Hello World!</p>')
```


## How it Works
`wkrk` does not do any magic, it's just syntactic sugar for your workers ✨

As an example, the following:

```js
import { wkrk } from "wkrk";

const routes = {
  "/users": {
    get(req, res) {
      return res.status(200).json({ name: "Giovanni" });
    },
  },
};

export default wkrk(routes);
```

Is equivalent to:

```js
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'GET') {
        const json = JSON.stringify({ name: "Giovanni" });
        return new Response(json);
    }

    return new Response("I don't know how to handle this request", { status: 500 });
  },
};
```

## File System Routing
API routes are great and are used by frameworks like [Next.js](https://nextjs.org/docs/api-routes/dynamic-api-routes) and [NuxtJS](https://nuxtjs.org/docs/features/file-system-routing/). However, [read the file system it's not possible](https://community.cloudflare.com/t/is-it-possible-to-pull-data-from-a-local-json-file-hosted-on-a-worker/134982/3). An alternative to this is to provide a compiler that pulls this data and generates the configuration for your router. However, I choosed to [keep it simple](https://en.wikipedia.org/wiki/KISS_principle) for now and avoid overcomplicate things in the very beginning.
