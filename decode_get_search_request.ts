export function decode_get_search_request<T>(
    request: Pick<Request, "method" | "url" | "headers">,
): T {
    const url = new URL(request.url);

    return JSON.parse(url.search ? atob(url.search.slice(1)) : "") as T;
}
