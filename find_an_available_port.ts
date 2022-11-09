import { assert } from "https://deno.land/std@0.163.0/testing/asserts.ts";

export function find_an_available_port(hostname = "0.0.0.0") {
    const listener = Deno.listen({ hostname, port: 0 });
    const addr = listener.addr;
    assert(addr.transport === "tcp");

    const port = addr.port;
    listener.close();
    return port;
}
