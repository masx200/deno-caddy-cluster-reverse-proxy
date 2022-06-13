import { handler } from "./handler.ts";
import { main } from "./main.ts";
if (import.meta.main) {
    await main(handler);
}
