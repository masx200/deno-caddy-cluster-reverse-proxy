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

export async function create_middleware(options: {
    create_Registry_Storage: () => Promise<RegistryStorage>;
    pathname_prefix: string;
    token: string;
}): Promise<Middleware> {
    const { pathname_prefix, create_Registry_Storage } = options;
    const Registry_Storage = await create_Registry_Storage();

    return async (ctx, next) => {
        if (ctx.request.url.startsWith(pathname_prefix)) {
        } else {
            await next();
        }
    };
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
