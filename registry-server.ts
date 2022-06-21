import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInformation } from "./ServerInformation.ts";

export async function register_with_storage(
    options: ServerInformation & {
        Registry_Storage: RegistryStorage;
        maxAge?: number;
    },
): Promise<void> {
    const { Registry_Storage, maxAge = 30 * 1000, ...rest } = options;
    const expires = Number(new Date()) + maxAge;
    await Registry_Storage.upsertServerInformation({ ...rest, expires });
}
export async function unregister_with_storage(
    options: { address: string } & {
        Registry_Storage: RegistryStorage;
    },
): Promise<void> {
    const { address, Registry_Storage } = options;
    await Registry_Storage.deleteServerInformation(address);
}
