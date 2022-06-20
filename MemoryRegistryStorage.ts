// deno-lint-ignore-file require-await
import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";

export async function MemoryRegistryStorage(): Promise<RegistryStorage> {
    const name_to_ids = new Map<string, Set<string>>();
    const id_to_server_info = new Map<
        string,
        ServerInfo & {
            expires: number;
        }
    >();
    const deleteServerInfo = async function deleteServerInfo(options: {
        id: string;
    }): Promise<void> {
        const { id } = options;

        id_to_server_info.delete(id);
        name_to_ids.forEach((set) => set.delete(id));
    };
    return {
        async getAllServices(): Promise<string[]> {
            return Array.from(name_to_ids.keys());
        },
        async getAllAddress({ name }: { name: string }): Promise<string[]> {
            const now = Number(new Date());
            const infos = Array.from(name_to_ids.get(name) ?? [])
                .map((id) => id_to_server_info.get(id))
                .filter((info) => info && info.expires > now) as Array<
                    ServerInfo & {
                        expires: number;
                    }
                >;
            await Promise.all(
                infos.map(async (info) => {
                    if (info.expires < now) {
                        await deleteServerInfo({ id: info.id });
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
            const { id, name } = options;
            const set = name_to_ids.get(name) ?? new Set();
            set.add(id);
            name_to_ids.set(name, set);
            id_to_server_info.set(id, options);
        },
        deleteServerInfo,
    };
}
