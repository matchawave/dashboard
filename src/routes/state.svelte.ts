import { SocketManager } from "$lib/socket_manager.svelte";
import type { APIPartialGuild, APIUser } from "discord-api-types/v10";
export const guildsState = $state<APIPartialGuild[]>([]);
export const darkModeState = $state<{ state: boolean }>({ state: false });
export const userState = $state<{ user: APIUser | null }>({ user: null });

export function toggleDarkMode(): void {
  darkModeState.state = !darkModeState.state;
}

export function addGuild(guild: APIPartialGuild): void {
  if (!guildsState.find((g) => g.id === guild.id)) {
    guildsState.push(guild);
  }
}

export function setGuilds(guilds: APIPartialGuild[]): void {
  guildsState.length = 0;
  guildsState.push(...guilds);
}

export function removeGuild(guildId: string): void {
  const index = guildsState.findIndex((g) => g.id === guildId);
  if (index !== -1) {
    guildsState.splice(index, 1);
  }
}
