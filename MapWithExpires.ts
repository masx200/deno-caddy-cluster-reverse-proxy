export class MapWithExpires<K, V extends { expires: number }> extends Map<
    K,
    V
> {
    forEach(
        callbackfn: (value: V, key: K, map: Map<K, V>) => void,
        // deno-lint-ignore no-explicit-any
        thisArg?: any,
        now = Number(new Date()),
    ): void {
        this.clean_expires(now);
        super.forEach(callbackfn, thisArg);
    }

    clean_expires(now = Number(new Date())) {
        const keys = super.keys();

        for (const key of keys) {
            const data = super.get(key);
            if (data && data.expires <= now) {
                this.delete(key);
            }
        }
        return;
    }
    has(key: K, now = Number(new Date())) {
        const data = super.get(key);
        if (data && data.expires <= now) {
            this.delete(key);
            return false;
        }
        return super.has(key);
    }
    get(key: K, now = Number(new Date())) {
        const data = super.get(key);
        if (data && data.expires <= now) {
            this.delete(key);
            return;
        }
        return data;
    }
    keys(now = Number(new Date())) {
        this.clean_expires(now);
        return super.keys();
    }
    values(now = Number(new Date())) {
        this.clean_expires(now);
        return super.values();
    }
    entries(now = Number(new Date())): IterableIterator<[K, V]> {
        this.clean_expires(now);
        return super.entries();
    }
}
