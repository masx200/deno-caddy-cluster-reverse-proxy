import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";

export async function register_with_storage(
    options: ServerInfo & {
        Registry_Storage: RegistryStorage;
        maxAge?: number;
    },
): Promise<void> {
    const { Registry_Storage, maxAge = 30 * 1000, ...rest } = options;
    const expires = Number(new Date()) + maxAge;
    await Registry_Storage.setServerInfo({ ...rest, expires });
}
export async function unregister_with_storage(
    options: { id: string } & {
        Registry_Storage: RegistryStorage;
    },
): Promise<void> {
    const { id, Registry_Storage } = options;
    await Registry_Storage.deleteServerInfo({ id });
}
