import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";
export async function decode_request<T>(
    options: { registry_pathname_prefix: string } & Pick<
        Request,
        "method" | "url" | "headers" | "body"
    >
): Promise<
    | ({ target: string } & T)
    | { status: number; body: string; headers: Headers }
> {}

export function encode_response<T>(options: T): Response {}

export async function create_handler(options: {
    Registry_Storage: RegistryStorage;
    registry_pathname_prefix: string;
    token: string;
}) {}
export async function register(
    options: ServerInfo & {
        token: string;
    }
): Promise<void | { status: number; body: string; headers: Headers }> {}

export async function unregister(
    options: { id: string } & { token: string }
): Promise<void | { status: number }> {}

export async function getAllServices(): Promise<string[]> {}
export async function getAllAddress({
    name,
}: {
    name: string;
}): Promise<string[]> {}
