import { assert } from "https://deno.land/std@0.143.0/testing/asserts.ts";
import { caddy_file_reverse_proxy_template } from "./caddy_file_reverse_proxy_template.ts";
import { find_an_available_port } from "./find_an_available_port.ts";
import { run_caddy_file } from "./run_caddy_file.ts";

export async function serve({
    hostname = "127.0.0.1",
    from_protocol = "http:",
    to_protocol = "http:",
    allowed_server_names = [],
    port,
    thread_count = navigator.hardwareConcurrency,
    start_child_process,
    signal,
}: {
    from_protocol?: string;
    to_protocol?: string;
    allowed_server_names?: string[];
    hostname?: string;
    port: number;
    thread_count?: number;
    signal?: AbortSignal;
    start_child_process: (options: {
        hostname: string;
        port: number;
    }) => Deno.Process | Promise<Deno.Process>;
}) {
    if (signal?.aborted) {
        return;
    }
    assert(
        ["http:", "https:"].includes(from_protocol),
        'protocol expected :["http:", "https:"]'
    );
    assert(
        ["http:", "https:"].includes(to_protocol),
        'protocol expected :["http:", "https:"]'
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
    const caddy_process = await run_caddy_file(caddy_file_text);
    console.log("child process caddy started");
    if (signal?.aborted) {
        return;
    }
    const children = await Promise.all(
        ports.map((port) => start_child_process({ hostname, port }))
    );
    const error_controller = new AbortController();
    caddy_process.status().then((status) => {
        caddy_process.close();
        if (signal?.aborted) {
            return;
        }
        console.error("child process caddy exited", status);
        children.forEach((process) => process.close());
        error_controller.abort(
            new Error("child process caddy exited:" + JSON.stringify(status))
        );
    });
    children.forEach(async (process, index) => {
        const child_port = ports[index];
        console.log(["child process port", child_port, "started"].join(" "));
        const status = await process.status();
        process.close();
        if (signal?.aborted) {
            return;
        }
        console.error(`child process port ${ports[index]} exited`, status);
    });
    signal?.addEventListener("abort", () => {
        children.forEach((process) => process.close());
        caddy_process.close();
    });
    return new Promise<void>((s, j) => {
        if (signal?.aborted) {
            return s();
        }
        if (error_controller.signal.aborted) {
            return j(error_controller.signal.reason);
        }
        error_controller.signal.addEventListener("abort", () => {
            return j(error_controller.signal.reason);
        });
        signal?.addEventListener("abort", () => {
            return s();
        });
    });
}
