import { RegistryServer } from "./RegistryServer.ts";
import { MemoryRegistryStorage } from "./MemoryRegistryStorage.ts";
import { handler } from "https://deno.land/x/masx200_hello_world_deno_deploy@1.1.5/mod.ts";
import { serve } from "https://deno.land/std@0.144.0/http/server.ts";

Deno.test("RegistryServer", async () => {
    const ac = new AbortController();
    const signal = ac.signal;
    const p = RegistryServer({
        signal,
        check_auth_token: (token) => token === "01234567890",
        Registry_Storage: MemoryRegistryStorage(),
        port: 20500,
        async onListen({ port, hostname }) {
            console.log("listening", { port, hostname });
            await serve(handler, {
                port: 19500,
                signal,
                async onListen({ port, hostname }) {
                    console.log("listening", { port, hostname });
                },
            });
        },
    });

    await p;
});
