import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";

export async function register(
    options: ServerInfo & {
        Registry_Storage: RegistryStorage;
        maxAge?: number;
    },
): Promise<void> {
    const { Registry_Storage, maxAge = 30 * 1000, ...rest } = options;
    const expires = Number(new Date()) + maxAge;
    await Registry_Storage.setServerInfo({ ...rest, expires });
}
export async function unregister(
    options: { id: string } & {
        Registry_Storage: RegistryStorage;
    },
): Promise<void> {
    const { id, Registry_Storage } = options;
    await Registry_Storage.deleteServerInfo({ id });
}
export async function getAllServices(options: {
    Registry_Storage: RegistryStorage;
}): Promise<string[]> {
    const { Registry_Storage } = options;
    return await Registry_Storage.getAllServices();
}
export async function getAllAddress({
    name,
    Registry_Storage,
}: { name: string } & { Registry_Storage: RegistryStorage }): Promise<
    string[]
> {
    return await Registry_Storage.getAllAddress({ name });
}
