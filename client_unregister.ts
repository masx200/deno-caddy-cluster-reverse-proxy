import { check_response_ok } from "./deps.ts";
import { encode_post_body_request } from "./encode_post_body_request.ts";

export async function client_unregister(
    options: { address: string } & {
        token: string;
        base_url: string;
    },
) {
    const { token, base_url, ...rest } = options;
    const request = encode_post_body_request(
        {
            ...rest,
            // target: "unregister",
        },
        new URL("unregister", base_url).toString(),
        // base_url
    );
    request.headers.set("Authorization", "Bearer " + token);
    const response = await fetch(request);
    await check_response_ok(response);
    await response.body?.cancel();
}
