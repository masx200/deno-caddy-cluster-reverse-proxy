export function encode_json_response<T>(data: T): Response {
    return new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" },
    });
}
