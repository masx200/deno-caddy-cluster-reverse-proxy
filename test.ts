import { RegistryServer } from "./RegistryServer.ts";
import { MemoryRegistryStorage } from "./MemoryRegistryStorage.ts";

await RegistryServer({
    check_auth_token: (token) => token === "01234567890",
    Registry_Storage: MemoryRegistryStorage(),
    port: 20500,
});
