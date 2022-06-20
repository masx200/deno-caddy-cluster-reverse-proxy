// deno-lint-ignore-file require-await
import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";

export async function MemoryRegistryStorage(): Promise<RegistryStorage> {
    const name_to_address = new Map<string, Set<string>>();
    const address_to_server_info = new Map<
        string,
        ServerInfo & {
            expires: number;
        }
    >();
    async function deleteServerInfo(options: {
        address: string;
    }): Promise<void> {
        const { address } = options;

        address_to_server_info.delete(address);
        name_to_address.forEach((set) => set.delete(address));
    }
    return {
        async getAllServerInfo() {
            const now = Number(new Date());
            const infos = Array.from(address_to_server_info.values());
            await Promise.all(
                infos.map(async (info) => {
                    if (info.expires < now) {
                        await deleteServerInfo({ address: info.address });
                    }
                }),
            );
            return infos;
        },
        async getAllServices(): Promise<string[]> {
            return Array.from(name_to_address.keys());
        },
        async getAllAddress({ name }: { name: string }): Promise<string[]> {
            const now = Number(new Date());
            const infos = Array.from(name_to_address.get(name) ?? [])
                .map((address) => address_to_server_info.get(address))
                .filter((info) => info && info.expires > now) as Array<
                    ServerInfo & {
                        expires: number;
                    }
                >;
            await Promise.all(
                infos.map(async (info) => {
                    if (info.expires < now) {
                        await deleteServerInfo({ address: info.address });
                    }
                }),
            );
            return infos.map((info) => info.address);
        },
        async setServerInfo(
            options: ServerInfo & {
                expires: number;
            },
        ): Promise<void> {
            const { address, name } = options;
            const set = name_to_address.get(name) ?? new Set();
            set.add(address);
            name_to_address.set(name, set);
            address_to_server_info.set(address, options);
        },
        deleteServerInfo,
    };
}
