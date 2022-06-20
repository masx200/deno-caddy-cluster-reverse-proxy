import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { AbortSignalPromisify } from "./AbortSignalPromisify.ts";
import { RegistryStorage } from "./RegistryStorage.ts";

export async function health_check_with_storage({
    Registry_Storage,
    signal,
}: {
    Registry_Storage: RegistryStorage;
    signal?: AbortSignal;
}) {
    const AllServerInfo = await Promise.race([
        Registry_Storage.getAllServerInfo(),
        AbortSignalPromisify(signal),
    ]);
    await Promise.all(
        AllServerInfo.map(async (info) => {
            const { address, health_status, health_uri } = info;

            try {
                const response = await fetch(health_uri, { signal });
                await Promise.race([
                    AbortSignalPromisify(signal),
                    response.text(),
                ]);
                const status = response.status;
                assertEquals(status, health_status);
            } catch (error) {
                if (error instanceof DOMException) {
                    return;
                }
                await Promise.race([
                    AbortSignalPromisify(signal),
                    Registry_Storage.deleteServerInfo({ address }),
                ]);
            }
        }),
    );
}