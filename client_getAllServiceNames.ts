import { check_response_ok } from "./deps.ts";
import { assert } from "https://deno.land/std@0.165.0/testing/asserts.ts";
// import { encode_get_search_request } from "./encode_get_search_request.ts";
import { decode_json_response } from "./decode_json_response.ts";

export async function client_getAllServiceNames(options: {
    base_url: string;
}): Promise<string[]> {
    const { base_url /* , ...rest  */ } = options;
    // const request = encode_get_search_request(
    //     {
    //         ...rest,
    //         // target: "getAllServiceNames",
    //     },
    //     new URL("getAllServiceNames", base_url).toString(),
    //     // base_url
    // );
    const request = new Request(
        new URL("getAllServiceNames", base_url).toString(),
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response<string[]>(response);
    assert(Array.isArray(result));
    return result as string[];
}
