import { RegistryServer } from "./RegistryServer.ts";
import { MemoryRegistryStorage } from "./MemoryRegistryStorage.ts";

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
        },
    });

    await p;
});
