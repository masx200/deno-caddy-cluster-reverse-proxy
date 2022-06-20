import { RegistryStorage } from "./RegistryStorage.ts";

import { delay } from "https://deno.land/std@0.144.0/async/delay.ts";
import { health_check_with_storage } from "./health_check_with_storage.ts";

export async function start_health_check(options: {
    Registry_Storage: RegistryStorage;
    signal?: AbortSignal;
    interval?: number;
}) {
    const { Registry_Storage, signal, interval = 20 * 1000 } = options;

    while (true) {
        await health_check_with_storage({ Registry_Storage, signal });
        await delay(interval, { signal });
    }
}
