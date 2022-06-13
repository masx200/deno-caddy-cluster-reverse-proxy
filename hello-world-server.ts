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

    const body = JSON.stringify(data);
    console.log("request", body);
    const response = new Response("hello_world:" + req.url, {
        headers: { "content-type": "text/html" },
    });

    return response;
}

if (import.meta.main) {
    await main();
}

async function main() {
    let { port, hostname, pingback } = parse(Deno.args);
    const on_listen = async function on_listen({
        port,
        hostname,
    }: {
        hostname: string;
        port: number;
    }) {
        console.log(`Listening on http://${hostname}:${port}`);
        if (typeof pingback === "string") {
            const [host, pingport] = pingback.split(":");
            const conn = await Deno.connect({
                port: Number(pingport),
                hostname: host,
            });
            conn.close();
        }
    };
    if (port || hostname) {
        port ??= 8000;
        hostname ??= "0.0.0.0";
        await serve(handler, { port, hostname, onListen: on_listen });
    } else {
        console.log("Listening on http://localhost:8000");

        await serve(handler, {
            hostname: "0.0.0.0",
            port: 8000,
            onListen: on_listen,
        });
    }
}
