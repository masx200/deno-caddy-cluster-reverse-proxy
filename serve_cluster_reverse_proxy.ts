import { assert } from "https://deno.land/std@0.143.0/testing/asserts.ts";
import { AbortSignalPromisify } from "./AbortSignalPromisify.ts";
import { caddy_file_reverse_proxy_template } from "./caddy_file_reverse_proxy_template.ts";
import { find_an_available_port } from "./find_an_available_port.ts";
import { run_caddy_file_process } from "./run_caddy_file_process.ts";
import{start_child_server_process}from"./start_child_server_process.ts"
export async function serve_cluster_reverse_proxy({
    onListen,
    
    hostname = "127.0.0.1",
    from_protocol = "http:",
    to_protocol = "http:",
    allowed_server_names = [],
    port,
    thread_count = navigator.hardwareConcurrency,
  
    signal,
}: {
   
    onListen?:
        | ((params: { hostname: string; port: number }) => void)
        | undefined;
    from_protocol?: string;
    to_protocol?: string;
    allowed_server_names?: string[];
    hostname?: string;
    port: number;
    thread_count?: number;
    signal?: AbortSignal;
    
}) {
    if (signal?.aborted) {
        return;
    }
const start_run_caddy_file = run_caddy_file_process
    assert(
        ["http:", "https:"].includes(from_protocol),
        'protocol expected :["http:", "https:"]',
    );
    assert(
        ["http:", "https:"].includes(to_protocol),
        'protocol expected :["http:", "https:"]',
    );
    const listener = Deno.listen({ hostname, port });
    listener.close();
    const from = allowed_server_names.length
        ? allowed_server_names.map((hostname) => ({
            hostname,
            port,
            protocol: from_protocol,
        }))
        : { port };
    const ports = Array(thread_count)
        .fill(0)
        .map(() => find_an_available_port(hostname));
    const to = ports.map((port) => ({
        port,
        hostname: hostname,
        protocol: to_protocol,
    }));
    const caddy_file_text = caddy_file_reverse_proxy_template(from, to);
    console.log(caddy_file_text);

    const [caddy_process, ...children] = await Promise.race([
        Promise.all([
            start_run_caddy_file({ caddy_file_text, signal }),

            ...ports.map((port) =>
                start_child_server_process({ hostname, port, signal })
            ),
        ]),
        AbortSignalPromisify(signal),
    ]);
    onListen?.({ hostname, port });
    const pendings: Promise<void>[] = [];
    async function clean() {
        // console.trace("clean1");
        children.forEach((process) => {
            try {
                process.kill("SIGKILL");
                process.close();
                // deno-lint-ignore no-empty
            } catch {}
        });

        try {
            caddy_process.kill("SIGKILL");
            caddy_process.close();
            // deno-lint-ignore no-empty
        } catch {}
        // console.trace("clean2");
        await Promise.allSettled(pendings);
        await Promise.allSettled(
            [caddy_process, ...children].map((process) => process.status()),
        );
        // console.trace("clean3");
    }
    try {
        console.log("child process caddy started");
        signal?.addEventListener("abort", async () => {
            await clean();
        });
        if (signal?.aborted) {
            await clean();
            return;
        }

        const error_controller = new AbortController();
        pendings.push(
            caddy_process.status().then((status) => {
                caddy_process.close();
                if (signal?.aborted) {
                    return;
                }
                console.error("child process caddy exited", status);
                children.forEach((process) => process.close());
                error_controller.abort(
                    new Error(
                        "child process caddy exited:" + JSON.stringify(status),
                    ),
                );
            }),
        );
        pendings.push(
            ...children.map(async (process, index) => {
                const child_port = ports[index];
                console.log(
                    ["child process port", child_port, "started"].join(" "),
                );
                const status = await process.status();
                process.close();
                if (signal?.aborted) {
                    return;
                }
                console.error(
                    `child process port ${ports[index]} exited`,
                    status,
                );
            }),
        );

        if (signal?.aborted) {
            await clean();
            return;
        }
        if (error_controller.signal.aborted) {
            return Promise.reject(error_controller.signal.reason);
        }

        return await new Promise<void>((s) => {
            error_controller.signal.addEventListener("abort", () => {
                return s(Promise.reject(error_controller.signal.reason));
            });
            signal?.addEventListener("abort", async () => {
                await clean();

                return s();
            });
        });
    } catch (e) {
        throw e;
    } finally {
        await clean();
    }
}
