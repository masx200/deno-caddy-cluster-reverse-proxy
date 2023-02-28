import { Middleware } from "https://deno.land/x/masx200_deno_http_middleware@2.2.2/mod.ts";
import { decode_get_search_request } from "./decode_get_search_request.ts";
import { decode_post_body_request } from "./decode_post_body_request.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
import { encode_json_response } from "./encode_json_response.ts";
import { BadRequestError } from "./BadRequestError.ts";
import {
    register_with_storage,
    unregister_with_storage,
} from "./registry-server.ts";

import { is_url } from "./is-url.ts";
import { BadRequestTypeError } from "./BadRequestTypeError.ts";
import { Unauthorized_Bearer_Authenticate } from "./Unauthorized_Bearer_Authenticate.ts";
import { assert } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { isPlainObject } from "./isPlainObject.ts";
export function create_middleware(options: {
    Registry_Storage: RegistryStorage;
    maxAge?: number;
    pathname_prefix?: string;
    check_auth_token: (token: string) => boolean | Promise<boolean>;
}): Middleware[] {
    const {
        pathname_prefix = "/",
        Registry_Storage,
        check_auth_token,
        maxAge = 30 * 1000,
    } = options;

    return [
        async (ctx, next) => {
            const pathname = new URL(ctx.request.url).pathname;
            if (
                ["HEAD", "GET"].includes(ctx.request.method) &&
                pathname.startsWith(pathname_prefix)
            ) {
                const target = pathname.slice(pathname_prefix.length);
                if (target === "getAllServerInformation") {
                    return encode_json_response(
                        await Registry_Storage.getAllServerInformation(),
                    );
                }
                if (target === "getAllServiceNames") {
                    return encode_json_response(
                        await Registry_Storage.getAllServiceNames(),
                    );
                }
            }
            return await next();
        },
        async (ctx, next) => {
            const pathname = new URL(ctx.request.url).pathname;
            if (
                ["HEAD", "GET"].includes(ctx.request.method) &&
                pathname.startsWith(pathname_prefix)
            ) {
                const target = pathname.slice(pathname_prefix.length);

                let data: Record<string, unknown> | undefined;

                try {
                    data = decode_get_search_request<Record<string, unknown>>(
                        ctx.request,
                    );
                    assert(isPlainObject(data));
                } catch (e) {
                    return BadRequestError(e);
                }
                // if ("target" in data) {
                // const { target } = data;

                if (target === "getServerInformation") {
                    const { address } = data;
                    if ("string" === typeof address && is_url(address)) {
                        return encode_json_response(
                            (await Registry_Storage.getServerInformation(
                                address,
                            )) ?? null,
                        );
                    } else {
                        return BadRequestTypeError();
                    }
                }

                if (target === "getAllAddress") {
                    const { name } = data;
                    if ("string" === typeof name) {
                        return encode_json_response(
                            await Registry_Storage.getAllAddress({
                                name,
                            }),
                        );
                    } else {
                        return BadRequestTypeError();
                    }
                    // }
                }
            }
            return await next();
        },
        async (ctx, next) => {
            const pathname = new URL(ctx.request.url).pathname;
            if (pathname.startsWith(pathname_prefix)) {
                if ("POST" === ctx.request.method) {
                    const Authorization =
                        ctx.request.headers.get("Authorization") ?? "";
                    const [bearer, api_token] = Authorization.split(" ");
                    if (
                        bearer !== "Bearer" ||
                        !(await check_auth_token(api_token))
                    ) {
                        return Unauthorized_Bearer_Authenticate();
                    }
                }
            }
            return await next();
        },
        async (ctx, next) => {
            const pathname = new URL(ctx.request.url).pathname;
            if (pathname.startsWith(pathname_prefix)) {
                if ("POST" === ctx.request.method) {
                    const target = pathname.slice(pathname_prefix.length);
                    let data: Record<string, unknown> | undefined;
                    try {
                        data = await decode_post_body_request<
                            Record<string, unknown>
                        >(ctx.request);
                        assert(isPlainObject(data));
                    } catch (e) {
                        return BadRequestError(e);
                    }

                    if (target === "unregister") {
                        const { address } = data;
                        if (typeof address === "string" && is_url(address)) {
                            await unregister_with_storage({
                                address: address,
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
                            health_url,
                            // health_status,
                        } = data;
                        if (
                            "string" === typeof address &&
                            "string" === typeof hostname &&
                            "string" === typeof protocol &&
                            "string" === typeof name &&
                            "string" === typeof health_url &&
                            // "number" === typeof health_status &&
                            "number" === typeof port && is_url(address) &&
                            is_url(health_url)
                        ) {
                            await register_with_storage({
                                address,
                                hostname,
                                protocol,
                                port,
                                maxAge,
                                name,
                                health_url,
                                // health_status,
                                Registry_Storage,
                            });
                            return new Response();
                        } else {
                            return BadRequestTypeError();
                        }
                        // }
                    }
                }
            }
            await next();
            return;
        },
    ];
}
