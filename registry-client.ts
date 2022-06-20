import { check_response_ok } from "./deps.ts";
import { ServerInfo } from "./ServerInfo.ts";
import { assert } from "https://deno.land/std@0.144.0/testing/asserts.ts";

export function encode_get_request<T>(
    options: T & {
        target: string;
    },
): Request {}
export function encode_post_request<T>(
    options: T & {
        target: string;
    },
): Request {}

export async function decode_response<T>(response: Response): Promise<T> {
    const result = await response.json();

    return result as T;
}
export async function register(
    options: ServerInfo & {
        token: string;
        registry_base_url: string;
    },
) {
    const request = encode_post_request({ ...options, target: "register" });
    const response = await fetch(request);
    await check_response_ok(response);
}

export async function unregister(
    options: { id: string } & {
        token: string;
        registry_base_url: string;
    },
) {
    const request = encode_post_request({ ...options, target: "unregister" });
    const response = await fetch(request);
    await check_response_ok(response);
}

export async function getAllServices(options: {
    registry_base_url: string;
}): Promise<string[]> {
    const request = encode_get_request({
        ...options,
        target: "getAllServices",
    });
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_response(response);
    assert(Array.isArray(result));
    return result as string[];
}
export async function getAllAddress(options: {
    name: string;
    registry_base_url: string;
}): Promise<string[]> {
    const request = encode_get_request({
        ...options,
        target: "getAllAddress",
    });
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_response(response);
    assert(Array.isArray(result));
    return result as string[];
}
