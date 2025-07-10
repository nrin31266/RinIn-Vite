import { CompatClient, Stomp } from "@stomp/stompjs";

let client: CompatClient | null = null;

export function getWebSocketClient(userId: string, token: string): CompatClient {
  if (!client) {
    client = Stomp.client(`${import.meta.env.VITE_API_BASE_WS_URL}?userId=${userId}&token=${token}`);
  }
  return client;
}
