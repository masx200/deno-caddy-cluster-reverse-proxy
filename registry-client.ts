import { check_response_ok } from "./deps.ts";
import { ServerInfo } from "./ServerInfo.ts";
import { assert } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { encode_get_search_request } from "./encode_get_search_request.ts";
import { encode_post_body_request } from "./encode_post_body_request.ts";
import { decode_json_response } from "./decode_json_response.ts";

export async function register(
    options: ServerInfo & {
        token: string;
        base_url: string;
    },
) {
    const { token, base_url, ...rest } = options;
    const request = encode_post_body_request(
        {
            ...rest,
            target: "register",
        },
        base_url,
    );
    request.headers.set("Authorization", "Bearer " + token);
    const response = await fetch(request);
    await check_response_ok(response);
}

export async function unregister(
    options: { id: string } & {
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

export async function getAllServices(options: {
    base_url: string;
}): Promise<string[]> {
    const { base_url, ...rest } = options;
    const request = encode_get_search_request(
        {
            ...rest,
            target: "getAllServices",
        },
        base_url,
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response(response);
    assert(Array.isArray(result));
    return result as string[];
}
export async function getAllAddress(options: {
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
    const result = await decode_json_response(response);
    assert(Array.isArray(result));
    return result as string[];
}
