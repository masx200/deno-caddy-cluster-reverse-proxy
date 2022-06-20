import { ServerInfo } from "./ServerInfo.ts";

export async function register({
    name,
    token,
    registry,
    service,
}: {
    name: string;
    token: string;
    registry: string;
    service: ServerInfo;
}) {}

export async function unregister({
    name,
    token,
    registry,
    service,
}: {
    name: string;
    token: string;
    registry: string;
    service: ServerInfo;
}) {}

export async function getAllServices({
    registry,
}: {
    registry: string;
}): Promise<string[]> {}
export async function getAllAddress({
    name,
    registry,
}: {
    name: string;
    registry: string;
}): Promise<string[]> {}
