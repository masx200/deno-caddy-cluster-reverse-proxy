// deno-lint-ignore-file require-await
import { Middleware } from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";
export type HttpError = Error & {
    name: "HttpError";

    status?: number;
    // deno-lint-ignore no-explicit-any
    body?: any;
    headers?: Headers;
};

export async function decode_get_request<T>(
    options:
        & { registry_pathname_prefix: string }
        & Pick<
            Request,
            "method" | "url" | "headers" | "body"
        >,
): Promise<{ target: string } & T> {}
export async function decode_post_request<T>(
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
    return async (ctx, next) => {};
}
export async function register(
    options: ServerInfo & {
        token: string;
    } & { Registry_Storage: RegistryStorage },
): Promise<void> {}
export async function unregister(
    options: { id: string } & { token: string } & {
        Registry_Storage: RegistryStorage;
    },
): Promise<void> {}
export async function getAllServices(options: {
    Registry_Storage: RegistryStorage;
}): Promise<string[]> {}
export async function getAllAddress({
    name,
}: { name: string } & { Registry_Storage: RegistryStorage }): Promise<
    string[]
> {}
