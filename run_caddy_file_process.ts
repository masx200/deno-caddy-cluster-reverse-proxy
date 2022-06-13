export async function run_caddy_file_process(caddy_file_text: string) {
    const pingport = find_an_available_port("127.0.0.1");
    const listener = Deno.listen({ hostname: "127.0.0.1", port: pingport });

    try {
        const process = Deno.run({
            cmd: [
                "caddy",
                "run",
                "--pingback",
                "127.0.0.1:" + pingport,
                "-adapter",
                "caddyfile",
                "-config",
                "-",
            ],
            stdin: "piped",
        });

        await writeAll(
            process.stdin,
            new TextEncoder().encode(caddy_file_text),
        );
        process.stdin.close();
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
import { writeAll } from "https://deno.land/std@0.143.0/streams/conversion.ts";
import { find_an_available_port } from "./find_an_available_port.ts";
