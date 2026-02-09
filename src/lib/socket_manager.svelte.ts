export class SocketManager {
  private socket = $state<WebSocket | null>(null);
  private host = $state<string>("ws://localhost:3000");
  private id = $state<string>("");
  readonly listeners = $state<Map<string, Array<(data: any) => void>>>(
    new Map()
  );

  setHost(host: string): void {
    let url = host;
    if (url.startsWith("http://")) {
      url = url.replace("http://", "ws://");
    } else if (url.startsWith("https://")) {
      url = url.replace("https://", "wss://");
    }
    this.host = url;
  }

  connect(id: string): void {
    if (id !== this.id) {
      this.socket = new WebSocket(`${this.host}/api/gateway/${id}`);
      this.id = id;

      this.socket.onopen = this.handleOnOpen;
      this.socket.onmessage = this.handleMessage;
      this.socket.onclose = this.handleOnClose;
      this.socket.onerror = this.handleOnError;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.listeners.clear();
      this.id = "";
    }
  }

  addListener<T>(event: string, listener: (data: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  send<T>(event: string, data: T): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, data }));
    }
  }

  private handleMessage(event: MessageEvent): void {
    const message = JSON.parse(event.data) as { event: string; data: any };
    const listeners = this.listeners.get(message.event);
    if (listeners) {
      listeners.forEach((listener) => listener(message.data));
    }
  }

  private handleOnOpen(event: Event): void {
    console.log("WebSocket connection established");
  }

  private handleOnClose(event: CloseEvent): void {
    console.log("WebSocket connection closed", event);
    this.socket = null;
    this.listeners.clear();
    this.id = "";
  }

  private handleOnError(event: Event): void {
    console.error("WebSocket error observed:", event);
    this.socket = null;
    this.listeners.clear();
    this.id = "";
  }
}
