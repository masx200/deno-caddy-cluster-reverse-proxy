export async function run_caddy_file(caddy_file_text: string) {
    const process = Deno.run({
        cmd: ["caddy", "run", "-adapter", "caddyfile", "-config", "-"],
        stdin: "piped",
    });

    await process.stdin.write(new TextEncoder().encode(caddy_file_text));
    process.stdin.close();
    return process;
}
