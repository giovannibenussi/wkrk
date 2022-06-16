import { ExtendedResponse } from "wkrk-extended";
import { extendedRequest, ExtendedRequestType } from "wkrk-extended";

export type WKRKParams<Env = unknown> = {
  req: ExtendedRequestType;
  res: ExtendedResponse;
  request: Request;
  env: Env;
  context: ExecutionContext;
};

type WKRKHandler =
  | undefined
  | ((params: WKRKParams) => Response)
  | ((params: WKRKParams) => Promise<Response>);

type MethodType = "get" | "post" | "put" | "delete";

export type WKRKRoute = {
  get?: WKRKHandler;
  post?: WKRKHandler;
  put?: WKRKHandler;
  delete?: WKRKHandler;
  handler?: WKRKHandler;
  default?: {
    get?: WKRKHandler;
    post?: WKRKHandler;
    handler?: WKRKHandler;
    put?: WKRKHandler;
    delete?: WKRKHandler;
  };
};

type RouteType = {
  [key: string]: WKRKRoute;
};

const getHandler = (req: Request, pathHandler: WKRKRoute) => {
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
