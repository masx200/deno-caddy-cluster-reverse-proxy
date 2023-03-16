export function encode_get_search_request<T>(
    data: T,
    base_url: string,
): Request {
    const url = new URL(base_url);
    const urlsp = new URLSearchParams();
    // deno-lint-ignore ban-ts-comment
    //@ts-ignore
    for (
        const [key, value] of Object.entries(
            data as { [s: string]: T } | ArrayLike<T>,
        )
    ) {
        urlsp.set(key, String(value));
    }
    url.search = urlsp.toString();
    return new Request(url.toString(), { method: "GET" });
}
