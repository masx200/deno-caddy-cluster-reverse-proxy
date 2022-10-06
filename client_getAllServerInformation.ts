import { check_response_ok } from "./deps.ts";
import { ServerInformation } from "./ServerInformation.ts";
import { assert } from "https://deno.land/std@0.159.0/testing/asserts.ts";
// import { encode_get_search_request } from "./encode_get_search_request.ts";
import { decode_json_response } from "./decode_json_response.ts";

export async function client_getAllServerInformation(options: {
    base_url: string;
}): Promise<
    (ServerInformation & {
        expires: number;
        last_check_time: number;
    })[]
> {
    const { base_url /* , ...rest  */ } = options;
    // const request = encode_get_search_request(
    //     {
    //         ...rest,
    //         // target: "getAllServerInformation",
    //     },
    //     // base_url
    //     new URL("getAllServerInformation", base_url).toString(),
    // );
    const request = new Request(
        new URL("getAllServerInformation", base_url).toString(),
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response<
        (ServerInformation & {
            expires: number;
            last_check_time: number;
        })[]
    >(response);
    assert(Array.isArray(result));
    return result as (ServerInformation & {
        expires: number;
        last_check_time: number;
    })[];
}
