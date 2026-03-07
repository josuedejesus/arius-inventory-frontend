import { useEffect, useRef } from "react";

type SSEHandler = (data: any) => void;

type SSEHandlers = {
  [event: string]: SSEHandler;
};

export const useSSE = (handlers: SSEHandlers) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const eventSource = new EventSource(`${apiUrl}/events`);
    eventSourceRef.current = eventSource;

    Object.entries(handlers).forEach(([event, handler]) => {
      eventSource.addEventListener(event, (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          handler(data);
        } catch (err) {
          console.error("Error parsing SSE data", err);
        }
      });
    });

    eventSource.onerror = (err) => {
      console.error("SSE connection error", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);
};
