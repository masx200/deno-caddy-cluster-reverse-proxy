import { find_an_available_port } from "./find_an_available_port.ts";

export async function start_child_process({
    hostname = "127.0.0.1",
    port,
}: {
    hostname?: string;
    port: number;
}) {
    const pingport = find_an_available_port("127.0.0.1");
    const listener = Deno.listen({ hostname: "127.0.0.1", port: pingport });
    try {
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
