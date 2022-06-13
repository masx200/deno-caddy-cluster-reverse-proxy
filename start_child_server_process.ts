import { find_an_available_port } from "./find_an_available_port.ts";

export async function start_child_server_process({
    hostname = "127.0.0.1",
    port,get_cmd,
    signal,
}: {get_cmd:()=>string[]
    hostname?: string;
    port: number;
    signal?: AbortSignal;
}) {
if (signal?.aborted) {
    return Promise.reject(new DOMException(" aborted.", "AbortError"));
  }
    const pingport = find_an_available_port("127.0.0.1");
/*[
            "deno",
            "run",
            "-A",
            "./hello-world-server.ts",
            `--hostname=${hostname}`,
            `--port=${port}`,
            "--pingback=127.0.0.1:" + pingport,
        ]*/
    const process = Deno.run({
        cmd: get_cmd({hostname,port,pingport,pinghost}),
    });
    const listener = Deno.listen({ hostname: "127.0.0.1", port: pingport });
    signal?.addEventListener("abort", () => {
        try {
            listener.close();
            // deno-lint-ignore no-empty
        } catch {}
        process.kill("SIGKILL");
        try {
            process.close();
            // deno-lint-ignore no-empty
        } catch {}
    });
    try {
        await Promise.race([
            (async () => {
                for await (const conn of listener) {
                    // console.log("conn", conn, conn.localAddr, conn.remoteAddr);
                    conn.close();
                    break;
                }
            })(),
            (async () => {
                const status = await process.status();
                if (!status.success) {
                    throw Error("process failure:" + JSON.stringify(status));
                }
            })(),
        ]);

        return process;
    } catch (error) {
        throw error;
    } finally {
        try {
            listener.close();
            // deno-lint-ignore no-empty
        } catch {}
    }
}
