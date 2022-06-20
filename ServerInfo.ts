export type ServerInfo = {
    address: string;
    hostname: string;
    protocol: string;
    port: number;

    health_uri: string;
    health_status: number;
    name: string;
};
