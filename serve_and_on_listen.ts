import { Handler, serve } from "https://deno.land/std@0.166.0/http/server.ts";

export function serve_and_on_listen({
    hostname,
    port,
    signal,
    handler,
}: {
    port: number;
    signal?: AbortSignal;
    hostname?: string;
    handler: Handler;
}): Promise<{ port: number; hostname: string }> {
    return new Promise<{ port: number; hostname: string }>(
        (resolve, reject) => {
            serve(handler, {
                port,
                signal,
                hostname,
                onListen({
                    port,
                    hostname,
                }: {
                    port: number;
                    hostname: string;
                }) {
                    console.log("listening", { port, hostname });
                    resolve({ port, hostname });
                },
            }).catch(reject);
        },
    );
}
