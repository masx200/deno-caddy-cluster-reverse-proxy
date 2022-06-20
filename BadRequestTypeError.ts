export function BadRequestTypeError() {
    return new Response("TypeError", { status: 400 });
}
