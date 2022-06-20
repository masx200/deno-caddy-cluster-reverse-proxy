import { ServerInfo } from "./ServerInfo.ts";
export function encode_request(
    options: {
        target: string;

        registry: string;
    } & Partial<
        ServerInfo & {
            token: string;
        }
    >
): Request {}
export async function decode_response<T>(options: Response): Promise<T> {}
export async function register(
    options: ServerInfo & {
        token: string;
        registry: string;
    }
) {}

export async function unregister(
    options: { id: string } & {
        token: string;
        registry: string;
    }
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
