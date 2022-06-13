import { ConnInfo, serve } from "https://deno.land/std@0.143.0/http/server.ts";
import { parse } from "https://deno.land/std@0.143.0/flags/mod.ts";
export function handler(req: Request, connInfo: ConnInfo): Response {
    const { url, headers, method } = req;

    const data = {
        connInfo,
        url,
        method,
        headers: Object.fromEntries(headers),
    };

    const body = JSON.stringify(data, null, 4);
    console.log("request", body);
    const response = new Response("hello_world:" + req.url, {
        headers: { "content-type": "text/html" },
    });
    // console.log("response", response);
    return response;
}
if (import.meta.main) {
    let { port, hostname } = parse(Deno.args);
    if (port || hostname) {
        port ??= 8000;
        hostname ??= "0.0.0.0";
        await serve(handler, { port, hostname });
    } else {
        console.log("Listening on http://localhost:8000");

        await serve(handler, { hostname: "0.0.0.0", port: 8000 });
    }
}
