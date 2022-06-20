export function Unauthorized_Bearer_Authenticate() {
    return new Response(null, {
        status: 401,
        headers: { "WWW-Authenticate": "Bearer realm=realm" },
    });
}
