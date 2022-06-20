import { Middleware } from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";
export type HttpError = Error & {
    name: "HttpError";

    status: number;
    body?: string;
    headers?: Headers;
};

export async function decode_request<T>(
    options:
        & { registry_pathname_prefix: string }
        & Pick<
            Request,
            "method" | "url" | "headers" | "body"
        >,
): Promise<{ target: string } & T> {}

export function encode_response<T>(options: T): Response {}

export async function create_middleware(options: {
    create_Registry_Storage: () => Promise<RegistryStorage>;
    registry_pathname_prefix: string;
    token: string;
}): Middleware {
    async function register(
        options: ServerInfo & {
            token: string;
        },
    ): Promise<void> {}

    async function unregister(
        options: { id: string } & { token: string },
    ): Promise<void> {}
    async function getAllServices(): Promise<string[]> {}
    async function getAllAddress({
        name,
    }: {
        name: string;
    }): Promise<string[]> {}
}
