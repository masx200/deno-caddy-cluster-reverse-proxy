import { check_response_ok } from "./deps.ts";
import { assert } from "https://deno.land/std@0.179.0/testing/asserts.ts";
import { encode_get_search_request } from "./encode_get_search_request.ts";
import { decode_json_response } from "./decode_json_response.ts";

export async function client_getAllAddress(options: {
    name: string;
    base_url: string;
}): Promise<string[]> {
    const { base_url, ...rest } = options;
    const request = encode_get_search_request(
        {
            ...rest,
            // target: "getAllAddress",
        },
        // base_url
        new URL("getAllAddress", base_url).toString(),
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response<string[]>(response);
    assert(Array.isArray(result));
    return result as string[];
}
