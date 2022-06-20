import { bodyToJSON } from "https://deno.land/x/masx200_deno_http_middleware@1.2.3/mod.ts";

export async function decode_post_body_request<T>(
    request: Pick<Request, "method" | "url" | "headers" | "body">,
): Promise<T> {
    return await bodyToJSON(request.body) as T;
}
