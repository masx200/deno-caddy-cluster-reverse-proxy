import { RegistryServer } from "./RegistryServer.ts";
import { MemoryRegistryStorage } from "./MemoryRegistryStorage.ts";
import { handler } from "https://deno.land/x/masx200_hello_world_deno_deploy@1.1.5/mod.ts";
import { serve } from "https://deno.land/std@0.144.0/http/server.ts";
import {
    client_getAllServerInformation,
    client_register,
    client_start_heart_beat,
} from "./registry-client.ts";
import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";

Deno.test("RegistryServer-registry-client", async () => {
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
                    await client_register({
                        health_url: "http://127.0.0.1:19500/health",
                        protocol: "http:",
                        address: "http://127.0.0.1:19500",
                        port,
                        hostname: "127.0.0.1",
                        name: "hello-world",
                        base_url: "http://127.0.0.1:20500",
                        signal,
                        token: "01234567890",
                    });
                    const AllServerInformation =
                        await client_getAllServerInformation({
                            base_url: "http://127.0.0.1:20500",
                        });
                    console.log("AllServerInformation", AllServerInformation);
                    const info_hello_world = AllServerInformation[0];
                    /*  {
    address: "http://127.0.0.1:19500",
    hostname: "127.0.0.1",
    protocol: "http:",
    port: 19500,
    name: "hello-world",
    health_url: "http://127.0.0.1:19500/health",
    expires: 1655796481246,
    last_check: 0
  } */
                    assertEquals(
                        info_hello_world.address,
                        "http://127.0.0.1:19500"
                    );
                    assertEquals(info_hello_world.name, "hello-world");
                    assertEquals(
                        info_hello_world.health_url,
                        "http://127.0.0.1:19500/health"
                    );
                    await client_start_heart_beat({
                        health_url: "http://127.0.0.1:19500/health",
                        protocol: "http:",
                        address: "http://127.0.0.1:19500",
                        port,
                        hostname: "127.0.0.1",
                        name: "hello-world",
                        base_url: "http://127.0.0.1:20500",
                        signal,
                        token: "01234567890",
                    });
                },
            });
        },
    });

    await p;
});
