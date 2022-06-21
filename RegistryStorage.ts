import { ServerInformation } from "./ServerInformation.ts";

export type RegistryStorage = {
    getServerInformation(
        address: string,
    ): Promise<
        | undefined
        | null
        | (ServerInformation & { expires: number; last_check: number })
    >;
    getAddressLastCheck(address: string): Promise<number>;
    setAddressLastCheck(address: string, last_check: number): Promise<void>;
    getAllServerInformation(): Promise<
        (ServerInformation & { expires: number; last_check: number })[]
    >;
    getAllServiceNames(): Promise<string[]>;
    getAllAddress({ name }: { name: string }): Promise<string[]>;
    upsertServerInformation(
        options: ServerInformation & {
            expires: number;
            last_check?: number;
        },
    ): Promise<void>;
    deleteServerInformation: (address: string) => Promise<void>;
};
