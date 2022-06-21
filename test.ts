import { RegistryServer } from "./RegistryServer.ts";
import { MemoryRegistryStorage } from "./MemoryRegistryStorage.ts";
import { handler } from "https://deno.land/x/masx200_hello_world_deno_deploy@1.1.5/mod.ts";
import { serve } from "https://deno.land/std@0.144.0/http/server.ts";
import {
    client_getAllAddress,
    client_getAllServerInformation,
    client_getAllServiceNames,
    client_register,
    client_start_heart_beat,
    client_unregister,
} from "./registry-client.ts";
import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.144.0/testing/asserts.ts";

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
                    const base_url = "http://127.0.0.1:20500";
                    const address = "http://127.0.0.1:19500";
                    const token = "01234567890";
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
                    let AllServerInformation =
                        await client_getAllServerInformation({
                            base_url: "http://127.0.0.1:20500",
                        });
                    console.log("AllServerInformation", AllServerInformation);
                    const info_hello_world = AllServerInformation[0];
                    assert(info_hello_world.expires > 0);
                    assert(info_hello_world.last_check > 0);
                    assertEquals(
                        info_hello_world.address,
                        "http://127.0.0.1:19500",
                    );
                    assertEquals(info_hello_world.name, "hello-world");
                    assertEquals(
                        info_hello_world.health_url,
                        "http://127.0.0.1:19500/health",
                    );
                    const o = client_start_heart_beat({
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
                    let AllServiceNames = await client_getAllServiceNames({
                        base_url,
                    });
                    console.log("AllServiceNames", AllServiceNames);
                    assertEquals(["hello-world"], AllServiceNames);
                    let AllAddress = await client_getAllAddress({
                        base_url,
                        name: "hello-world",
                    });
                    console.log("AllAddress", AllAddress);
                    assertEquals(["http://127.0.0.1:19500"], AllAddress);
                    await client_unregister({
                        token,
                        base_url,
                        address: address,
                    });
                    AllServerInformation = await client_getAllServerInformation(
                        {
                            base_url: "http://127.0.0.1:20500",
                        },
                    );
                    console.log("AllServerInformation", AllServerInformation);
                    assertEquals(0, AllServerInformation.length);
                    AllServiceNames = await client_getAllServiceNames({
                        base_url,
                    });
                    console.log("AllServiceNames", AllServiceNames);
                    assertEquals([], AllServiceNames);
                    AllAddress = await client_getAllAddress({
                        base_url,
                        name: "hello-world",
                    });
                    console.log("AllAddress", AllAddress);
                    assertEquals([], AllAddress);
                    ac.abort();
                    await o;
                },
            });
        },
    });

    await p;
});
