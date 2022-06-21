import { assert } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { AbortSignalPromisify } from "./AbortSignalPromisify.ts";
import { RegistryStorage } from "./RegistryStorage.ts";

export async function health_check_with_storage({
    Registry_Storage,
    signal,
    interval = 20 * 1000,
}: {
    Registry_Storage: RegistryStorage;
    signal?: AbortSignal;
    interval?: number;
}) {
    const AllServerInformation = await Promise.race([
        Registry_Storage.getAllServerInformation(),
        AbortSignalPromisify(signal),
    ]);
    const now = Number(new Date());
    await Promise.all(
        AllServerInformation.map(async (info) => {
            const { address, /* health_status,  */ health_url, last_check } =
                info;
            if (now - last_check < interval) {
                return;
            }
            try {
                const response = await fetch(health_url, {
                    signal,
                    method: "HEAD",
                });
                assert(response.ok);
                await response.body?.cancel();
                // await Promise.race([
                //     AbortSignalPromisify(signal),
                //     response.text(),
                // ]);
                // const status = response.status;
                // assertEquals(status, health_status);
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
}
