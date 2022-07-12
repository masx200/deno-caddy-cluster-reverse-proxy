import { check_response_ok } from "./deps.ts";
import { ServerInformation } from "./ServerInformation.ts";
import { encode_post_body_request } from "./encode_post_body_request.ts";
import { AbortSignalPromisify } from "./AbortSignalPromisify.ts";

export async function client_register(
    options: ServerInformation & {
        token: string;
        base_url: string;
        signal?: AbortSignal;
    },
) {
    const { signal, token, base_url, ...rest } = options;
    const request = encode_post_body_request(
        {
            ...rest,
            // target: "register",
        },
        new URL("register", base_url).toString(),
    );
    request.headers.set("Authorization", "Bearer " + token);
    const response = await fetch(request, { signal });
    await Promise.race([
        AbortSignalPromisify(signal),
        check_response_ok(response),
    ]);
    await response.body?.cancel();
}
