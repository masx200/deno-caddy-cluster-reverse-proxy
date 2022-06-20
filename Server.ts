export type Server = {
    hostname: string;
    protocol: string;
    port: number;
    id: string;
    health_uri: string;
    health_status: number;
    name: string;
};
