import { serve, ServeInit } from "https://deno.land/std@0.144.0/http/server.ts";
import {
    conditional_get,
    createHandler,
    etag_builder,
    logger,
} from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";
import { create_middleware } from "./create_middleware.ts";

import { RegistryStorage } from "./RegistryStorage.ts";
import { start_health_check } from "./start_health_check.ts";
export function RegistryServer({
    check_auth_token,
    Registry_Storage,
    pathname_prefix,
}: {
    check_auth_token: (token: string) => Promise<boolean>;
    Registry_Storage: RegistryStorage;
    pathname_prefix: string;
}) {
    const handler = createHandler([
        logger,
        conditional_get,
        etag_builder,
        create_middleware({
            Registry_Storage: Registry_Storage,
            pathname_prefix,
            check_auth_token,
        }),
    ]);
    async function start(options: Partial<ServeInit> = {}) {
        const rest = options;
        await Promise.all([
            serve(handler, { ...rest }),
            start_health_check({ Registry_Storage, ...rest }),
        ]);
    }
    return start;
}
