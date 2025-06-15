import { createContext, useContext, useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import { getWebSocketClient } from "./socket";
import type { CompatClient } from "@stomp/stompjs";

const WsContext = createContext<CompatClient | null>(null);
export const useWebSocket = () => useContext(WsContext);

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.id) return;

    const client = getWebSocketClient(user.id.toString());

    if (!client.connected) {
      client.connect(
        { userId: user.id.toString() },
        () => {
          console.log("✅ Connected WebSocket");
          setStompClient(client);

          const interval = setInterval(() => {
            if (client.connected) {
              client.send("/app/ping", {}, "{}");
            }
          }, 10000);

          // Clear interval on disconnect
          client.onDisconnect = () => clearInterval(interval);
        },
        (err: unknown) => console.log("❌ WS connect error", err)
      );
    }

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("🔌 Disconnected"));
      }
    };
  }, [user?.id]);

  return (
    <WsContext.Provider value={stompClient}>{children}</WsContext.Provider>
  );
};

export default WebSocketProvider;
