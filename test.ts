import { serve_cluster_reverse_proxy } from "./serve_cluster_reverse_proxy.ts";
import { start_child_process } from "./start_child_process.ts";

Deno.test("http-hello-world-reverse-proxy-allowed_server_names", async () => {
    const controller = new AbortController();
    const { signal } = controller;
    const p = serve_cluster_reverse_proxy({
        allowed_server_names: ["localhost"],
        start_child_process,
        port: 28000,
        hostname: "127.0.0.1",
        signal,
    });
    controller.abort();
    await p;
});
