import { Middleware } from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";
import { decode_get_search_request } from "./decode_get_search_request.ts";
import { decode_post_body_request } from "./decode_post_body_request.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
import { encode_json_response } from "./encode_json_response.ts";
import { BadRequestError } from "./BadRequestError.ts";
import {
    getAllAddress,
    getAllServices,
    register,
    unregister,
} from "./registry-server.ts";
import { BadRequestTypeError } from "./BadRequestTypeError.ts";
import { Unauthorized_Bearer_Authenticate } from "./Unauthorized_Bearer_Authenticate.ts";

export function create_middleware(options: {
    promise_Registry_Storage: Promise<RegistryStorage>;
    pathname_prefix: string;
    auth_token: string;
}): Middleware {
    const { pathname_prefix, promise_Registry_Storage, auth_token } = options;

    return async (ctx, next) => {
        const Registry_Storage = await promise_Registry_Storage;
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
                    return Unauthorized_Bearer_Authenticate();
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
