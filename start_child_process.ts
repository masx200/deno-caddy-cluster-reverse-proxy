export function start_child_process({
    hostname = "127.0.0.1",
    port,
}: {
    hostname?: string;
    port: number;
}) {
    return Deno.run({
        cmd: [
            "deno",
            "run",
            "-A",
            "./hello-world-server.ts",
            `--hostname=${hostname}`,
            `--port=${port}`,
        ],
    });
}
