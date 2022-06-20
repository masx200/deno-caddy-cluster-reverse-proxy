import { ServerInfo } from "./ServerInfo.ts";
export async function decode_request<T>(
    options:
        & { registry_pathname_prefix: string }
        & Pick<
            Request,
            "method" | "url" | "headers" | "body"
        >,
): Promise<T> {}
export function encode_response(options: string[] | void): Response {}
export async function register(
    options: ServerInfo & {
        token: string;
    },
) {}

export async function unregister(options: { id: string } & { token: string }) {}

export async function getAllServices(): Promise<string[]> {}
export async function getAllAddress({
    name,
}: {
    name: string;
}): Promise<string[]> {}
