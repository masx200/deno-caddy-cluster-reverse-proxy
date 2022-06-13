import { serve_cluster_reverse_proxy } from "./serve_cluster_reverse_proxy.ts";
import { start_child_process } from "./start_child_process.ts";
import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test(
    "http-hello-world-reverse-proxy-allowed_server_names-localhost",
    async () => {
        const controller = new AbortController();
        const { signal } = controller;
        const p = serve_cluster_reverse_proxy({
            allowed_server_names: ["localhost"],
            start_child_process,
            port: 28000,
            hostname: "127.0.0.1",
            signal,
        });
        await delay(3000);
        const base = "http://localhost:28000";
        const urls = Array(10)
            .fill(0)
            .map(() => new URL(String(Math.random()), base));
        const responses = await Promise.all(urls.map((url) => fetch(url)));
        // console.log(responses);
        assert(responses.every((response) => response.ok));
        const texts = await Promise.all(
            responses.map((response) => response.text()),
        );
        texts.forEach((value, index) => {
            console.log(value);
            assertEquals(value, "hello_world:" + String(urls[index]));
        });
        controller.abort();
        await p;
    },
);
import { delay } from "https://deno.land/std@0.143.0/async/delay.ts";
Deno.test(
    "http-hello-world-reverse-proxy-allowed_server_names-empty",
    async () => {
        const controller = new AbortController();
        const { signal } = controller;
        const p = serve_cluster_reverse_proxy({
            allowed_server_names: [],
            start_child_process,
            port: 28000,
            hostname: "127.0.0.1",
            signal,
        });
        await delay(3000);
        const base = "http://127.0.0.1:28000";
        const urls = Array(10)
            .fill(0)
            .map(() => new URL(String(Math.random()), base));
        const responses = await Promise.all(urls.map((url) => fetch(url)));
        // console.log(responses);
        assert(responses.every((response) => response.ok));
        const texts = await Promise.all(
            responses.map((response) => response.text()),
        );
        texts.forEach((value, index) => {
            console.log(value);
            assertEquals(value, "hello_world:" + String(urls[index]));
        });
        controller.abort();
        await p;
    },
);
