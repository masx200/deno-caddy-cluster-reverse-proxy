import { find_an_available_port } from "./find_an_available_port.ts";

export async function start_child_server_process({
    hostname = "127.0.0.1",
    port,
    signal,
}: {
    hostname?: string;
    port: number;
    signal?: AbortSignal;
}) {
    const pingport = find_an_available_port("127.0.0.1");

    const process = Deno.run({
        cmd: [
            "deno",
            "run",
            "-A",
            "./hello-world-server.ts",
            `--hostname=${hostname}`,
            `--port=${port}`,
            "--pingback=127.0.0.1:" + pingport,
        ],
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
        for await (const conn of listener) {
            // console.log("conn", conn, conn.localAddr, conn.remoteAddr);
            conn.close();
            break;
        }
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
