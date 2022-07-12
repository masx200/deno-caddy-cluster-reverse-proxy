import { check_response_ok } from "./deps.ts";
import { ServerInformation } from "./ServerInformation.ts";
import { encode_get_search_request } from "./encode_get_search_request.ts";
import { decode_json_response } from "./decode_json_response.ts";

export async function client_getServerInformation(options: {
    base_url: string;
    address: string;
}): Promise<
    | (ServerInformation & {
        expires: number;
        last_check_time: number;
    })
    | undefined
    | null
> {
    const { base_url, ...rest } = options;
    const request = encode_get_search_request(
        {
            ...rest,
            // target: "getServerInformation",
        },
        // base_url
        new URL("getServerInformation", base_url).toString(),
    );
    const response = await fetch(request);
    await check_response_ok(response);
    const result = await decode_json_response<
        | undefined
        | null
        | (ServerInformation & {
            expires: number;
            last_check_time: number;
        })[]
    >(response);

    return result as
        | undefined
        | null
        | (ServerInformation & {
            expires: number;
            last_check_time: number;
        });
}
