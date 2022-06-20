import { ServerInformation } from "./ServerInformation.ts";

export type RegistryStorage = {
    getAllServiceNames(): Promise<string[]>;
    getAllAddress({ name }: { name: string }): Promise<string[]>;
    upsertServerInformation(
        options: ServerInformation & { expires: number },
    ): Promise<void>;
    deleteServerInformation(options: { address: string }): Promise<void>;
    getAllServerInformation(): Promise<
        Array<ServerInformation & { expires: number }>
    >;
};
