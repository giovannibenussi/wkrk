import { ExtendedResponse } from "wkrk-extended";
import { extendedRequest, ExtendedRequestType } from "wkrk-extended";

type HandlerParams = {
  req: ExtendedRequestType;
  res: ExtendedResponse;
  request: Request;
  env: object;
  context: any;
};

type Handler =
  | undefined
  | ((params: HandlerParams) => Response)
  | ((params: HandlerParams) => Promise<Response>);

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
  async fetch(originalRequest: Request, env: object, context: any) {
    const req = extendedRequest(originalRequest);
    const res = new ExtendedResponse({ request: originalRequest });
    const pathname = new URL(originalRequest.url).pathname;
    const pathHandler = routes[pathname];
    if (!pathHandler) {
      const errorMessage = `Don't know how to handle the ${pathname} path. Check your routes configuration.`;
      return res.error(errorMessage);
    }
    const handler = getHandler(originalRequest, pathHandler);
    if (!handler) {
      const errorMessage = `Unknown request method: ${originalRequest.method}`;
      return res.error(errorMessage);
    }

    return handler({ req, res, request: originalRequest, env, context });
  },
});
