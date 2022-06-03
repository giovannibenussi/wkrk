import { ExtendedResponse } from "wkrk-extended";
declare type Handler = undefined | ((req: Request, res: ExtendedResponse) => Response) | ((req: Request, res: ExtendedResponse) => Promise<Response>);
declare type Path = {
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
declare type RouteType = {
    [key: string]: Path;
};
export declare const wkrk: (routes: RouteType) => {
    fetch(req: Request): Promise<Response>;
};
export {};
