export function Unauthorized_Bearer_Authenticate() {
    return new Response("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": "Bearer realm=realm" },
    });
}
