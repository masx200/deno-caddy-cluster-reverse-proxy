import { Middleware } from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";
import { decode_get_search_request } from "./decode_get_search_request.ts";
import { decode_post_body_request } from "./decode_post_body_request.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
import { ServerInfo } from "./ServerInfo.ts";

import { encode_json_response } from "./encode_json_response.ts";
export async function health_check(options: {
    promise_Registry_Storage: Promise<RegistryStorage>;
    signal: AbortSignal;
}) {

    
}
export function create_middleware(options: {
    promise_Registry_Storage: Promise<RegistryStorage>;
    pathname_prefix: string;
    auth_token: string;
}): Middleware {
    const { pathname_prefix, promise_Registry_Storage, auth_token } = options;
    const cp = promise_Registry_Storage;

    return async (ctx, next) => {
        const Registry_Storage = await cp;
        const pathname = new URL(ctx.request.url).pathname;
        if (pathname.startsWith(pathname_prefix)) {
            if (["HEAD", "GET"].includes(ctx.request.method)) {
                let data: Record<string, unknown>;

                try {
                    data = decode_get_search_request<Record<string, unknown>>(
                        ctx.request,
                    );
                } catch (e) {
                    return BadRequestError(e);
                }
                if ("target" in data) {
                    const { target } = data;
                    if (target === "getAllServices") {
                        return encode_json_response(
                            await getAllServices({ Registry_Storage }),
                        );
                    }

                    if (target === "getAllAddress") {
                        const { name } = data;
                        if ("string" === typeof name) {
                            return encode_json_response(
                                await getAllAddress({
                                    name,
                                    Registry_Storage,
                                }),
                            );
                        } else {
                            return BadRequestTypeError();
                        }
                    }
                }
            }
            if ("POST" === ctx.request.method) {
                let data: Record<string, unknown>;
                try {
                    data = await decode_post_body_request<
                        Record<string, unknown>
                    >(ctx.request);
                } catch (e) {
                    return BadRequestError(e);
                }
                const Authorization =
                    ctx.request.headers.get("Authorization") ?? "";
                const [bearer, api_token] = Authorization.split(" ");
                if (bearer !== "Bearer" || api_token !== auth_token) {
                    return Unauthorized_Bearer_Response();
                }
                if ("target" in data) {
                    const { target } = data;
                    if (target === "unregister") {
                        if (typeof data.id === "string") {
                            await unregister({ id: data.id, Registry_Storage });
                            return new Response();
                        } else {
                            return BadRequestTypeError();
                        }
                    }
                    if (target === "register") {
                        const {
                            address,
                            hostname,
                            protocol,
                            port,
                            id,
                            name,
                            health_uri,
                            health_status,
                        } = data;
                        if (
                            "string" === typeof address &&
                            "string" === typeof hostname &&
                            "string" === typeof protocol &&
                            "string" === typeof name &&
                            "string" === typeof id &&
                            "string" === typeof health_uri &&
                            "number" === typeof health_status &&
                            "number" === typeof port
                        ) {
                            await register({
                                address,
                                hostname,
                                protocol,
                                port,
                                id,
                                name,
                                health_uri,
                                health_status,
                                Registry_Storage,
                            });
                            return new Response();
                        } else {
                            return BadRequestTypeError();
                        }
                    }
                }
            }
        }
        await next();
        return;
    };
}
// deno-lint-ignore no-explicit-any
function BadRequestError(e: any) {
    return new Response(String(e), { status: 400 });
}

function BadRequestTypeError() {
    return new Response("TypeError", { status: 400 });
}

function Unauthorized_Bearer_Response() {
    return new Response(null, {
        status: 401,
        headers: { "WWW-Authenticate": "Bearer realm=realm" },
    });
}
const maxAge = 30 * 1000;
export async function register(
    options: ServerInfo & { Registry_Storage: RegistryStorage },
): Promise<void> {
    const { Registry_Storage, ...rest } = options;
    const expires = Number(new Date()) + maxAge;
    await Registry_Storage.setServerInfo({ ...rest, expires });
}
export async function unregister(
    options: { id: string } & {
        Registry_Storage: RegistryStorage;
    },
): Promise<void> {
    const { id, Registry_Storage } = options;
    await Registry_Storage.deleteServerInfo({ id });
}
export async function getAllServices(options: {
    Registry_Storage: RegistryStorage;
}): Promise<string[]> {
    const { Registry_Storage } = options;
    return await Registry_Storage.getAllServices();
}
export async function getAllAddress({
    name,
    Registry_Storage,
}: { name: string } & { Registry_Storage: RegistryStorage }): Promise<
    string[]
> {
    return await Registry_Storage.getAllAddress({ name });
}
