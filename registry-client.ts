import { ServerInfo } from "./ServerInfo.ts";
export function encode_request<T>(
    options: T & {
        target: string;
    },
): Request {}
export async function decode_response<T>(options: Response): Promise<T> {}
export async function register(
    options: ServerInfo & {
        token: string;
        registry_base_url: string;
    },
) {}

export async function unregister(
    options: { id: string } & {
        token: string;
        registry_base_url: string;
    },
) {}

export async function getAllServices({
    registry_base_url,
}: {
    registry_base_url: string;
}): Promise<string[]> {}
export async function getAllAddress({
    name,
    registry_base_url,
}: {
    name: string;
    registry_base_url: string;
}): Promise<string[]> {}
