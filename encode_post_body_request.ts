export function encode_post_body_request<T>(
    data: T,
    base_url: string,
): Request {
    return new Request(base_url, {
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
    });
}
