import { serve_cluster_reverse_proxy } from "./serve_cluster_reverse_proxy.ts";

import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.143.0/testing/asserts.ts";
import {
    assertSpyCalls,
    spy,
} from "https://deno.land/std@0.143.0/testing/mock.ts";
Deno.test(
    "http-hello-world-reverse-proxy-allowed_server_names-localhost",
    async () => {
        const onListen = spy(async function onListen({
            port,
            hostname,
        }: {
            hostname: string;
            port: number;
        }) {
            console.log(`Listening on http://${hostname}:${port}`);

            const base = "http://localhost:28000";
            const urls = Array(5)
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
        });
        const controller = new AbortController();
        const { signal } = controller;
        const p = serve_cluster_reverse_proxy({
            onListen,
            allowed_server_names: ["localhost"],
            get_run_options({ hostname, port, pinghost, pingport }) {
                return {
                    cmd: [
                        "deno",
                        "run",
                        "-A",
                        "./hello-world-server.ts",
                        `--hostname=${hostname}`,
                        `--port=${port}`,
                        `--pingback=${pinghost}:` + pingport,
                    ],
                };
            },
            port: 28000,
            hostname: "127.0.0.1",
            signal,
        });

        await p;
        assertSpyCalls(onListen, 1);
    },
);

Deno.test(
    "http-hello-world-reverse-proxy-allowed_server_names-empty",
    async () => {
        const onListen = spy(async function onListen({
            port,
            hostname,
        }: {
            hostname: string;
            port: number;
        }) {
            console.log(`Listening on http://${hostname}:${port}`);

            const base = "http://127.0.0.1:28000";
            const urls = Array(4)
                .fill(0)
                .map(() => new URL(String(Math.random()), base));
            const responses = await Promise.all(
                urls.map((url) => fetch(url)),
            );
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
        });
        const controller = new AbortController();
        const { signal } = controller;
        const p = serve_cluster_reverse_proxy({
            allowed_server_names: [],
            get_run_options({ hostname, port, pinghost, pingport }) {
                return {
                    cmd: [
                        "deno",
                        "run",
                        "-A",
                        "./hello-world-server.ts",
                        `--hostname=${hostname}`,
                        `--port=${port}`,
                        `--pingback=${pinghost}:` + pingport,
                    ],
                };
            },
            port: 28000,
            hostname: "127.0.0.1",
            signal,
            onListen,
        });

        await p;
        assertSpyCalls(onListen, 1);
    },
);
