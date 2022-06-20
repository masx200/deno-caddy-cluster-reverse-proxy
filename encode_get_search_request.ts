export function encode_get_search_request<T>(
    data: T,
    base_url: string,
): Request {
    const url = new URL(base_url);
    url.searchParams.set("", JSON.stringify(data));
    return new Request(url.toString(), { method: "GET" });
}
