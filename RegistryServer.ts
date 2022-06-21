import {
    serve,
    ServeInit,
    serveTls,
    ServeTlsInit,
} from "https://deno.land/std@0.144.0/http/server.ts";
import {
    conditional_get,
    createHandler,
    etag_builder,
    logger,
    stream_etag,
} from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";
import { create_middleware } from "./create_middleware.ts";

import { RegistryStorage } from "./RegistryStorage.ts";
import { start_health_check } from "./start_health_check.ts";
export async function RegistryServer({
    check_auth_token,
    Registry_Storage,
    pathname_prefix,
    maxAge,
    interval,
    ...rest
}: (ServeTlsInit | ServeInit) & {
    check_auth_token: (token: string) => boolean | Promise<boolean>;
    Registry_Storage: RegistryStorage;
    pathname_prefix?: string;
    interval?: number;
    maxAge?: number;
}) {
    const handler = createHandler([
        logger,
        conditional_get,
        etag_builder,
        stream_etag(),
        create_middleware({
            Registry_Storage: Registry_Storage,
            pathname_prefix,
            check_auth_token,
            maxAge,
        }),
    ]);

    await Promise.all([
        "keyFile" in rest
            ? serveTls(handler, rest)
            : serve(handler, { ...rest }),
        start_health_check({ Registry_Storage, interval, ...rest }),
    ]);
}
