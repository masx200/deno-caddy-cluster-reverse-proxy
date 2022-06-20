import { Server } from "./Server.ts";

export async function register({
    name,
    token,
    registry,
    service,
}: {
    name: string;
    token: string;
    registry: string;
    service: Server;
}) {}
export async function heartbeat({
    name,
    token,
    registry,
    signal,
    service,
    interval = 15 * 1000,
}: {
    signal?: AbortSignal;
    name: string;
    interval?: number;
    token: string;
    registry: string;
    service: Server;
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
    service: Server;
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
