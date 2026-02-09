export type Status =
  | "offline"
  | "connected"
  | "connecting"
  | "disconnected"
  | "handshake"
  | "identifying"
  | "resuming"
  | "unknown";

export interface ShardWithGuildCount {
  shard: number;
  status: Status;
  latency: number | null; // in milliseconds
  guilds: number;
  users: number;
  started: string | null;
}
