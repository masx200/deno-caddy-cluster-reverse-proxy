export function decode_get_search_request<T>(
    request: Pick<Request, "method" | "url" | "headers" | "body">,
): T {
    const url = new URL(request.url);

    return JSON.parse(url.searchParams.get("") ?? "") as T;
}
