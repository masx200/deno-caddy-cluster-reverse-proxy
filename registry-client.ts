import { check_response_ok } from "./deps.ts";
import { ServerInformation } from "./ServerInformation.ts";
import { assert } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { encode_get_search_request } from "./encode_get_search_request.ts";
import { encode_post_body_request } from "./encode_post_body_request.ts";
import { decode_json_response } from "./decode_json_response.ts";
import { delay } from "https://deno.land/std@0.144.0/async/delay.ts";
import { AbortSignalPromisify } from "./AbortSignalPromisify.ts";

export async function client_register(
    options: ServerInformation & {
        token: string;
        base_url: string;
        signal?: AbortSignal;
    },
) {
    const { signal, token, base_url, ...rest } = options;
    const request = encode_post_body_request(
        {
            ...rest,
            target: "register",
        },
        base_url,
    );
    request.headers.set("Authorization", "Bearer " + token);
    const response = await fetch(request, { signal });
    await Promise.race([
        AbortSignalPromisify(signal),
        check_response_ok(response),
    ]);
}
export async function client_start_heart_beat(
    options: ServerInformation & {
        token: string;
        base_url: string;
        signal?: AbortSignal;
        interval?: number;
    },
) {
    const { signal, interval = 20 * 1000, ...rest } = options;

    while (true) {
        await client_register({ ...rest, signal });
        await delay(interval, { signal });
    }
}
export async function client_unregister(
    options: { address: string } & {
        token: string;
        base_url: string;
    },
) {
    const { token, base_url, ...rest } = options;
    const request = encode_post_body_request(
        {
            ...rest,
            target: "unregister",
        },
        base_url,
    );
    request.headers.set("Authorization", "Bearer " + token);
    const response = await fetch(request);
    await check_response_ok(response);
}
export async function client_getAllServerInformation(options: {
    base_url: string;
}): Promise<
    (ServerInformation & {
        expires: number;
    })[]
> {
    const { base_url, ...rest } = options;
    const request = encode_get_search_request(
        {
            ...rest,
            target: "getAllServerInformation",
        },
        base_url,
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response<
        (ServerInformation & {
            expires: number;
        })[]
    >(response);
    assert(Array.isArray(result));
    return result as (ServerInformation & {
        expires: number;
    })[];
}
export async function client_getAllServiceNames(options: {
    base_url: string;
}): Promise<string[]> {
    const { base_url, ...rest } = options;
    const request = encode_get_search_request(
        {
            ...rest,
            target: "getAllServiceNames",
        },
        base_url,
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response<string[]>(response);
    assert(Array.isArray(result));
    return result as string[];
}
export async function client_getAllAddress(options: {
    name: string;
    base_url: string;
}): Promise<string[]> {
    const { base_url, ...rest } = options;
    const request = encode_get_search_request(
        {
            ...rest,
            target: "getAllAddress",
        },
        base_url,
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response<string[]>(response);
    assert(Array.isArray(result));
    return result as string[];
}
