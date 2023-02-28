import { ServerInformation } from "./ServerInformation.ts";
import { delay } from "https://deno.land/std@0.178.0/async/delay.ts";
import { client_register } from "./client_register.ts";

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
        try {
            await client_register({ ...rest, signal });
            await delay(interval, { signal });
        } catch (error) {
            if (error instanceof DOMException) {
                return;
            } else {
                throw error;
            }
        }
    }
}
