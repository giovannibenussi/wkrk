import { ExtendedResponse } from "wkrk-extended";
import { ExtendedRequest } from "wkrk-extended";

type Handler =
  | undefined
  | ((req: Request, res: ExtendedResponse) => Response)
  | ((req: Request, res: ExtendedResponse) => Promise<Response>);

type MethodType = "get" | "post" | "put" | "delete";

type Path = {
  get?: Handler;
  post?: Handler;
  put?: Handler;
  delete?: Handler;
  handler?: Handler;
  default?: {
    get?: Handler;
    post?: Handler;
    handler?: Handler;
    put?: Handler;
    delete?: Handler;
  };
};

type RouteType = {
  [key: string]: Path;
};

const getHandler = (req: Request, pathHandler: Path) => {
  const method = req.method.toLowerCase();
  if (["get", "post", "put", "delete"].includes(method)) {
    return (
      pathHandler[method as MethodType] ||
      pathHandler.default?.[method as MethodType] ||
      pathHandler.handler
    );
  }

  return pathHandler.handler;
};

const pathIsInRoutes = (routes: RouteType, path: string) =>
  Object.keys(routes).includes(path);

export const wkrk = (routes: RouteType) => ({
  async fetch(req: Request) {
    const requestProxy = new ExtendedRequest(req);
    const responseProxy = new ExtendedResponse();
    const pathname = new URL(req.url).pathname;
    const pathHandler = routes[pathname];
    if (!pathHandler) {
      const errorMessage = `Don't know how to handle the ${pathname} path. Check your routes configuration.`;
      return responseProxy.error(errorMessage);
    }
    const handler = getHandler(req, pathHandler);
    if (!handler) {
      const errorMessage = `Unknown request method: ${req.method}`;
      return responseProxy.error(errorMessage);
    }

    return handler(req, responseProxy);
  },
});
