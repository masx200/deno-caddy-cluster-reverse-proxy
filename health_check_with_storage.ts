import { RegistryStorage } from "./RegistryStorage.ts";

export async function health_check_with_storage({
    Registry_Storage,
    signal,
}: {
    Registry_Storage: RegistryStorage;
    signal?: AbortSignal;
}) {}
