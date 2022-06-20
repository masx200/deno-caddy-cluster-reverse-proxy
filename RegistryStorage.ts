import { ServerInfo } from "./ServerInfo.ts";

export type RegistryStorage = {
    getAllServices(): Promise<string[]>;
    getAllAddress({ name }: { name: string }): Promise<string[]>;
    setServerInfo(options: ServerInfo & { expires: number }): Promise<void>;
    deleteServerInfo(options: { address: string }): Promise<void>;
    getAllServerInfo(): Promise<Array<ServerInfo & { expires: number }>>;
};
