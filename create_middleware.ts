import { Middleware } from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";
import { decode_get_search_request } from "./decode_get_search_request.ts";
import { decode_post_body_request } from "./decode_post_body_request.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
import { encode_json_response } from "./encode_json_response.ts";
import { BadRequestError } from "./BadRequestError.ts";
import {
    register_with_storage,
    unregister_with_storage,
} from "./registry-server.ts";
import { BadRequestTypeError } from "./BadRequestTypeError.ts";
import { Unauthorized_Bearer_Authenticate } from "./Unauthorized_Bearer_Authenticate.ts";
import { assert } from "https://deno.land/std@0.144.0/testing/asserts.ts";
// deno-lint-ignore no-explicit-any
export function isPlainObject(value: any) {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
}
export function create_middleware(options: {
    Registry_Storage: RegistryStorage;
    pathname_prefix: string;
    auth_token: string;
}): Middleware {
    const { pathname_prefix, Registry_Storage, auth_token } = options;

    return async (ctx, next) => {
        const pathname = new URL(ctx.request.url).pathname;
        if (pathname.startsWith(pathname_prefix)) {
            if (["HEAD", "GET"].includes(ctx.request.method)) {
                let data: Record<string, unknown> | undefined;

                try {
                    data = decode_get_search_request<Record<string, unknown>>(
                        ctx.request,
                    );
                    assert(isPlainObject(data));
                } catch (e) {
                    return BadRequestError(e);
                }
                if ("target" in data) {
                    const { target } = data;
                    if (target === "getAllServerInfo") {
                        return encode_json_response(
                            await Registry_Storage.getAllServerInfo(),
                        );
                    }
                    if (target === "getAllServices") {
                        return encode_json_response(
                            await Registry_Storage.getAllServices(),
                        );
                    }

                    if (target === "getAllAddress") {
                        const { name } = data;
                        if ("string" === typeof name) {
                            return encode_json_response(
                                await Registry_Storage.getAllAddress({ name }),
                            );
                        } else {
                            return BadRequestTypeError();
                        }
                    }
                }
            }
            if ("POST" === ctx.request.method) {
                let data: Record<string, unknown> | undefined;
                try {
                    data = await decode_post_body_request<
                        Record<string, unknown>
                    >(ctx.request);
                    assert(isPlainObject(data));
                } catch (e) {
                    return BadRequestError(e);
                }
                const Authorization =
                    ctx.request.headers.get("Authorization") ?? "";
                const [bearer, api_token] = Authorization.split(" ");
                if (bearer !== "Bearer" || api_token !== auth_token) {
                    return Unauthorized_Bearer_Authenticate();
                }
                if ("target" in data) {
                    const { target } = data;
                    if (target === "unregister") {
                        if (typeof data.address === "string") {
                            await unregister_with_storage({
                                address: data.address,
                                Registry_Storage,
                            });
                            return new Response();
                        } else {
                            return BadRequestTypeError();
                        }
                    }
                    if (target === "register") {
                        const {
                            hostname,
                            protocol,
                            port,
                            address,
                            name,
                            health_uri,
                            health_status,
                        } = data;
                        if (
                            "string" === typeof address &&
                            "string" === typeof hostname &&
                            "string" === typeof protocol &&
                            "string" === typeof name &&
                            "string" === typeof health_uri &&
                            "number" === typeof health_status &&
                            "number" === typeof port
                        ) {
                            await register_with_storage({
                                address,
                                hostname,
                                protocol,
                                port,

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
