// deno-lint-ignore-file require-await
import { MapWithExpires } from "./MapWithExpires.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInformation } from "./ServerInformation.ts";

export function MemoryRegistryStorage(): RegistryStorage {
    const name_to_address = new Map<string, Set<string>>();
    const address_to_server_info = new MapWithExpires<
        string,
        ServerInformation & {
            expires: number;
            last_check: number;
        }
    >();

    async function deleteServerInformation(address: string): Promise<void> {
        address_to_server_info.delete(address);
        name_to_address.forEach(function (set, key) {
            set.delete(address);
            if (set.size === 0) {
                name_to_address.delete(key);
            }
        });
    }
    return {
        async getServerInformation(
            address: string
        ): Promise<
            | (ServerInformation & { expires: number; last_check: number })
            | undefined
            | null
        > {
            const now = Number(new Date());
            const info = address_to_server_info.get(address);
            if (!info) return;
            if (info.expires < now) {
                await deleteServerInformation(info.address);
                return;
            }

            return info;
        },
        async getAddressLastCheck(address: string): Promise<number> {
            return address_to_server_info.get(address)?.last_check ?? 0;
        },
        async setAddressLastCheck(
            address: string,
            last_check: number
        ): Promise<void> {
            const server_info = address_to_server_info.get(address);
            if (server_info) {
                server_info.last_check = last_check;
            }
        },
        async getAllServerInformation() {
            const now = Number(new Date());
            const infos = Array.from(address_to_server_info.values()).filter(
                (info) => info && info.expires > now
            );
            await Promise.all(
                infos.map(async (info) => {
                    if (info.expires < now) {
                        await deleteServerInformation(info.address);
                    }
                })
            );
            return infos;
        },
        async getAllServiceNames(): Promise<string[]> {
            return Array.from(name_to_address.keys());
        },
        async getAllAddress({ name }: { name: string }): Promise<string[]> {
            const now = Number(new Date());
            const infos = Array.from(name_to_address.get(name) ?? [])
                .map((address) => address_to_server_info.get(address))
                .filter((info) => info && info.expires > now) as Array<
                ServerInformation & {
                    expires: number;
                }
            >;
            await Promise.all(
                infos.map(async (info) => {
                    if (info.expires < now) {
                        await deleteServerInformation(info.address);
                    }
                })
            );
            return infos.map((info) => info.address);
        },
        async upsertServerInformation(
            options: ServerInformation & {
                expires: number;
                last_check?: number;
            }
        ): Promise<void> {
            const { address, name, last_check = 0 } = options;
            const set = name_to_address.get(name) ?? new Set();
            set.add(address);
            name_to_address.set(name, set);
            address_to_server_info.set(address, { ...options, last_check });
        },
        deleteServerInformation,
    };
}
