import { CompatClient, Stomp } from "@stomp/stompjs";

let client: CompatClient | null = null;

export function getWebSocketClient(token: string): CompatClient {
  if (!client) {
    client = Stomp.client(`${import.meta.env.VITE_API_BASE_WS_URL}?token=${token}`);
  }
  return client;
}
