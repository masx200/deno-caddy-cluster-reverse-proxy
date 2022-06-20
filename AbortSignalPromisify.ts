export async function AbortSignalPromisify(signal?: AbortSignal) {
    if (signal?.aborted) {
        throw new DOMException("AbortError", "AbortError");
    }
    return await new Promise<never>((_resolve, reject) => {
        signal?.addEventListener("abort", () => {
            reject(new DOMException("AbortError", "AbortError"));
        });
    });
}
