import { RegistryServer } from "./RegistryServer.ts";
import { MemoryRegistryStorage } from "./MemoryRegistryStorage.ts";
import { check_response_ok } from "./deps.ts";
import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
import {
    client_getAllAddress,
    client_getAllServerInformation,
    client_getAllServiceNames,
    client_getServerInformation,
    client_register,
    client_start_heart_beat,
    client_unregister,
} from "./mod.ts";
import {
    assert,
    assertEquals,
    assertRejects,
} from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { serve_and_on_listen } from "./serve_and_on_listen.ts";
import { handler } from "https://deno.land/x/masx200_hello_world_deno_deploy@1.1.6/mod.ts";
Deno.test("RegistryServer-registry-client-one", async () => {
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
                    console.log(
                        await assertRejects(async () => {
                            const response_404 = await fetch(
                                "http://127.0.0.1:20500/404",
                            );

                            await check_response_ok(response_404);
                        }, "Not Found"),
                    );

                    console.log(
                        await assertRejects(async () => {
                            const response_404 = await fetch(
                                "http://127.0.0.1:20500/",
                                { method: "DELETE" },
                            );

                            await check_response_ok(response_404);
                        }, "Not Found"),
                    );

                    console.log(
                        await assertRejects(async () => {
                            await client_register({
                                health_url: "http://127.0.0.1:19500/health",
                                protocol: "http:",
                                address: "http://127.0.0.1:19500",
                                port,
                                hostname: "127.0.0.1",
                                name: "hello-world",
                                base_url: "http://127.0.0.1:20500",
                                signal,
                                token: "aaaaaaaaaaa",
                            });
                        }, "www-authenticate"),
                    );
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
                    assert(info_hello_world.last_check_time > 0);
                    assertEquals(
                        info_hello_world.address,
                        "http://127.0.0.1:19500",
                    );
                    assertEquals(info_hello_world.name, "hello-world");
                    assertEquals(
                        info_hello_world.health_url,
                        "http://127.0.0.1:19500/health",
                    );
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
                    const info_hello_world2 = await client_getServerInformation(
                        { base_url, address },
                    );
                    console.log("info_hello_world2", info_hello_world2);
                    assert(info_hello_world2);
                    assert(info_hello_world2.expires > 0);
                    assert(info_hello_world2.last_check_time > 0);
                    assertEquals(
                        info_hello_world2.address,
                        "http://127.0.0.1:19500",
                    );
                    assertEquals(info_hello_world2.name, "hello-world");
                    assertEquals(
                        info_hello_world2.health_url,
                        "http://127.0.0.1:19500/health",
                    );
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
                    await client_unregister({
                        token,
                        base_url,
                        address: address,
                    });
                    assertEquals(
                        null,
                        await client_getServerInformation({
                            base_url,
                            address,
                        }),
                    );
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
Deno.test("RegistryServer-registry-client-two", async () => {
    const ac = new AbortController();
    const signal = ac.signal;
    async function onListen([
        { port, hostname },
        { port: port2, hostname: hostname2 },
    ]: {
        port: number;
        hostname: string;
    }[]) {
        console.log("listening", { port, hostname });
        console.log("listening", { port: port2, hostname: hostname2 });
        const base_url = "http://127.0.0.1:20500";
        const address = "http://127.0.0.1:19500";
        const token = "01234567890";
        console.warn(
            await assertRejects(async () => {
                await client_register({
                    health_url: "http://127.0.0.1:19500/health",
                    protocol: "http:",
                    address: "http://127.0.0.1:19500",
                    port,
                    hostname: "127.0.0.1",
                    name: "hello-world",
                    base_url: "http://127.0.0.1:20500",
                    signal,
                    token: "aaaaaaaaaaa",
                });
            }, "www-authenticate"),
        );
        console.warn(
            await assertRejects(async () => {
                await client_register({
                    health_url: "http嘻嘻嘻127.0.0.1:19500/health哈哈",
                    protocol: "http:",
                    address: "http嘻嘻嘻127.0.0.1:19500/嘻嘻",
                    port,
                    hostname: "127.0.0.1",
                    name: "hello-world",
                    base_url: "http://127.0.0.1:20500",
                    signal,
                    token: "01234567890",
                });
            }, "not is url"),
        );
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
        await client_register({
            health_url: "http://127.0.0.1:19600/health",
            protocol: "http:",
            address: "http://127.0.0.1:19600",
            port: 19600,
            hostname: "127.0.0.1",
            name: "hello-world",
            base_url: "http://127.0.0.1:20500",
            signal,
            token: "01234567890",
        });
        let AllServerInformation = await client_getAllServerInformation({
            base_url: "http://127.0.0.1:20500",
        });
        console.log("AllServerInformation", AllServerInformation);
        assertEquals(2, AllServerInformation.length);
        const info_hello_world = AllServerInformation[0];
        assert(info_hello_world.expires > 0);
        assert(info_hello_world.last_check_time > 0);
        assertEquals(info_hello_world.address, "http://127.0.0.1:19500");
        assertEquals(info_hello_world.name, "hello-world");
        assertEquals(
            info_hello_world.health_url,
            "http://127.0.0.1:19500/health",
        );
        assertEquals(
            new Set(AllServerInformation.map((i) => i.address)),
            new Set(["http://127.0.0.1:19600", "http://127.0.0.1:19500"]),
        );
        assertEquals(
            new Set(AllServerInformation.map((i) => i.port)),
            new Set([19600, 19500]),
        );
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
        const o2 = client_start_heart_beat({
            health_url: "http://127.0.0.1:19600/health",
            protocol: "http:",
            address: "http://127.0.0.1:19600",
            port: 19600,
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
        assertEquals(
            ["http://127.0.0.1:19500", "http://127.0.0.1:19600"],
            AllAddress,
        );
        const info_hello_world2 = await client_getServerInformation({
            base_url,
            address,
        });
        console.log("info_hello_world2", info_hello_world2);
        assert(info_hello_world2);
        assert(info_hello_world2.expires > 0);
        assert(info_hello_world2.last_check_time > 0);
        assertEquals(info_hello_world2.address, "http://127.0.0.1:19500");
        assertEquals(info_hello_world2.name, "hello-world");
        assertEquals(
            info_hello_world2.health_url,
            "http://127.0.0.1:19500/health",
        );
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
        await client_unregister({
            token,
            base_url,
            address: address,
        });
        await client_unregister({
            token,
            base_url,
            address: "http://127.0.0.1:19600",
        });
        assertEquals(
            null,
            await client_getServerInformation({
                base_url,
                address,
            }),
        );
        AllServerInformation = await client_getAllServerInformation({
            base_url: "http://127.0.0.1:20500",
        });
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
        await Promise.all([o2, o]);
    }
    const p = RegistryServer({
        signal,
        check_auth_token: (token) => token === "01234567890",
        Registry_Storage: MemoryRegistryStorage(),
        port: 20500,
        async onListen({ port, hostname }) {
            console.log("listening", { port, hostname });
            await onListen(
                await Promise.all([
                    serve_and_on_listen({ port: 19500, signal, handler }),
                    serve_and_on_listen({ port: 19600, signal, handler }),
                ]),
            );
        },
    });

    await p;
});
