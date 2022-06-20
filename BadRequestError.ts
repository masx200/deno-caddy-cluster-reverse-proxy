// deno-lint-ignore no-explicit-any
export function BadRequestError(e: any) {
    return new Response(String(e), { status: 400 });
}
