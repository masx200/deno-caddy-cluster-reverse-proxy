export function decode_get_search_request<T>(
    request: Pick<Request, "method" | "url" | "headers">,
): T {
    const url = new URL(request.url);

    return Object.fromEntries(url.searchParams) as T;
}
