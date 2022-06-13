import { ConnInfo } from "https://deno.land/std@0.143.0/http/server.ts";

export function handler(req: Request, connInfo: ConnInfo): Response {
    const { url, headers, method } = req;

    const data = {
        connInfo,
        url,
        method,
        headers: Object.fromEntries(headers),
    };

    const body = JSON.stringify(data);
    console.log("request", body);
    const response = new Response("hello_world:" + req.url, {
        headers: { "content-type": "text/html" },
    });

    return response;
}
