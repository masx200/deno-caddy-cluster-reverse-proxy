export function caddy_file_reverse_proxy_template(
    from:
        | { port: number; hostname: string; protocol: string }[]
        | { port: number },
    to: { port: number; hostname: string; protocol: string }[],
) {
    const up_tls = to[0].protocol === "https:";
    return `{
        admin off
        debug
        local_certs
        auto_https disable_redirects
}

${
        "port" in from ? ":" + from.port : from
            .map(
                ({ port, hostname, protocol }) =>
                    `${protocol}//` + [hostname, port].join(":"),
            )
            .join(",\n")
    } {
	encode zstd gzip

	reverse_proxy ${
        to
            .map(
                ({ port, hostname, protocol }) =>
                    `${protocol}//` + [hostname, port].join(":"),
            )
            .join(" ")
    } {
            trusted_proxies private_ranges
            transport http {
                ${up_tls ? "tls_insecure_skip_verify" : ""}
            }
    }
}
`;
}
