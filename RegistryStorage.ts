import { ServerInformation } from "./ServerInformation.ts";

export type RegistryStorage = {
    getServerInformation(
        address: string,
    ): Promise<
        | undefined
        | null
        | (ServerInformation & { expires: number; last_check_time: number })
    >;
    getAddressLastCheck(address: string): Promise<number>;
    setAddressLastCheck(
        address: string,
        last_check_time: number,
    ): Promise<void>;
    getAllServerInformation(): Promise<
        (ServerInformation & { expires: number; last_check_time: number })[]
    >;
    getAllServiceNames(): Promise<string[]>;
    getAllAddress({ name }: { name: string }): Promise<string[]>;
    upsertServerInformation(
        options: ServerInformation & {
            expires: number;
            last_check_time?: number;
        },
    ): Promise<void>;
    deleteServerInformation: (address: string) => Promise<void>;
};
