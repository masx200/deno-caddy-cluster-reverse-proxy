import throttle from "https://cdn.skypack.dev/lodash@4.17.21/throttle?dts";
import { assert } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { AbortSignalPromisify } from "./AbortSignalPromisify.ts";
import { RegistryStorage } from "./RegistryStorage.ts";
// const Registry_Storage_to_throttled_health_check = new WeakMap<
//     RegistryStorage,
//     typeof health_check_with_storage
// >();
export const health_check_with_storage = throttle(
    async function health_check_with_storage(
        // // deno-lint-ignore no-explicit-any
        // this: any,
        options: {
            Registry_Storage: RegistryStorage;
            signal?: AbortSignal;
            interval?: number;
        },
    ): Promise<void> {
        const { Registry_Storage, signal, interval = 20 * 1000 } = options;
        // if (this !== health_check_with_storage) {
        //     const throttled_health_check =
        //         Registry_Storage_to_throttled_health_check.get(Registry_Storage);
        //     if (throttled_health_check) {
        //         return await throttled_health_check(options);
        //     } else {
        //         const throttled_health_check_created = throttle(
        //             health_check_with_storage.bind(
        //                 health_check_with_storage,
        //                 options,
        //             ),
        //             interval,
        //         ) as typeof health_check_with_storage;
        //         Registry_Storage_to_throttled_health_check.set(
        //             Registry_Storage,
        //             throttled_health_check_created,
        //         );
        //         return await throttled_health_check_created(options);
        //     }
        // }

        const now = Number(new Date());

        const AllServerInformation = await Promise.race([
            Registry_Storage.getAllServerInformation(),
            AbortSignalPromisify(signal),
        ]);

        await Promise.all(
            AllServerInformation.map(async (info) => {
                const { address, health_url, last_check_time } = info;

                if (
                    last_check_time > 0 &&
                    now - last_check_time - interval < 0
                ) {
                    return;
                }
                try {
                    const response = await fetch(health_url, {
                        signal,
                        method: "HEAD",
                    });
                    assert(response.ok);
                    await response.body?.cancel();
                } catch (error) {
                    if (error instanceof DOMException) {
                        return;
                    }
                    await Promise.race([
                        AbortSignalPromisify(signal),
                        Registry_Storage.deleteServerInformation(address),
                    ]);
                } finally {
                    await Registry_Storage.setAddressLastCheck(address, now);
                }
            }),
        );
    },
);
