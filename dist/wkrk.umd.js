!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("wkrk-extended")):"function"==typeof define&&define.amd?define(["exports","wkrk-extended"],t):t((e||self).wkrk={},e.wkrkExtended)}(this,function(e,t){e.wkrk=function(e){return{fetch:function(n){try{new t.ExtendedRequest(n);var r=new t.ExtendedResponse,o=new URL(n.url).pathname,d=e[o];if(!d)return Promise.resolve(r.error("Don't know how to handle the "+o+" path. Check your routes configuration."));var u=function(e,t){var n,r=e.method.toLowerCase();return["get","post","put","delete"].includes(r)&&(t[r]||(null==(n=t.default)?void 0:n[r]))||t.handler}(n,d);return Promise.resolve(u?u(n,r):r.error("Unknown request method: "+n.method))}catch(e){return Promise.reject(e)}}}}});
//# sourceMappingURL=wkrk.umd.js.map
