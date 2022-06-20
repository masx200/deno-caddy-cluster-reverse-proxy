export async function decode_json_response<T>(response: Response): Promise<T> {
    const result = await response.json();

    return result as T;
}
