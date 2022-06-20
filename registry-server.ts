import { ServerInfo } from "./ServerInfo.ts";
export async function register(
    options: ServerInfo & {
        token: string;
        registry: string;
    },
) {}

export async function unregister(
    options: Pick<ServerInfo, "id"> & {
        token: string;
        registry: string;
    },
) {}

export async function getAllServices({
    registry,
}: {
    registry: string;
}): Promise<string[]> {}
export async function getAllAddress({
    name,
    registry,
}: {
    name: string;
    registry: string;
}): Promise<string[]> {}
