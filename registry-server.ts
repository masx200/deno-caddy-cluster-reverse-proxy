import { ServerInfo } from "./ServerInfo.ts";
export async function decode_request<T>(
    options: { registry_pathname_prefix: string } & Pick<
        Request,
        "method" | "url" | "headers" | "body"
    >
): Promise<({ target: string } & T) | { status: number; message: string }> {}

export function encode_response<T>(options: T): Response {}
export async function register(
    options: ServerInfo & {
        token: string;
    }
): Promise<void | { status: number; message: string }> {}

export async function unregister(
    options: { id: string } & { token: string }
): Promise<void | { status: number }> {}

export async function getAllServices(): Promise<string[]> {}
export async function getAllAddress({
    name,
}: {
    name: string;
}): Promise<string[]> {}
