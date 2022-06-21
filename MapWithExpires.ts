export class MapWithExpires<K, V extends { expires: number }> extends Map<
    K,
    V
> {
    get(key: K) {
        const now = Number(new Date());
        const data = super.get(key);
        if (data && data.expires < now) {
            this.delete(key);
            return;
        }
        return data;
    }
    values() {
        const keys = Array.from(super.keys());
        const now = Number(new Date());

        const values = Array.from(super.values());
        keys.forEach((key) => {
            const data = this.get(key);
            if (data && data.expires < now) {
                this.delete(key);
                return;
            }
        });
        return values.filter((data) => data.expires > now)[Symbol.iterator]();
    }
}
