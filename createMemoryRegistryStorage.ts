import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";

export async function createMemoryRegistryStorage(): Promise<RegistryStorage> {
    return {
        getAllServices(): Promise<string[]> {},
        getAllAddress({ name }: { name: string }): Promise<string[]> {},
        setServerInfo(
            options: ServerInfo & {
                expires: number;
            },
        ): Promise<void> {},
        deleteServerInfo(options: { id: string }): Promise<void> {},
    };
}
