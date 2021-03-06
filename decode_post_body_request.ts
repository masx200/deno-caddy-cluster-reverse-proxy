import { bodyToJSON } from "https://deno.land/x/masx200_deno_http_middleware@1.2.5/mod.ts";

export async function decode_post_body_request<T>(
    request: Pick<Request, "method" | "url" | "headers"> & {
        body?: BodyInit | null | undefined;
    },
): Promise<T> {
    return (await bodyToJSON(request.body)) as T;
}
