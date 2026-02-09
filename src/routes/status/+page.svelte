<script lang="ts">
  import { onMount } from "svelte";
  import type { LayoutProps } from "../$types";
  import type { ShardWithGuildCount } from "$lib/status";
  import Shard from "$components/status/shard.svelte";

  const { children, data }: LayoutProps = $props();
  const apiHost = $derived<string>(data.apiHost);

  const shards = $state<ShardWithGuildCount[]>([]);
  let filteredShards = $state<number[]>([]);
  let displayedShards = $derived.by(() => {
    if (filteredShards.length === 0) return shards;
    return shards.filter((shard) => filteredShards.includes(shard.shard));
  });

  async function fetchShards() {
    const res = await fetch(`${apiHost}/api/shards`, {
      method: "GET",
    });

    if (!res.ok)
      return console.error("Failed to fetch shards:", res.statusText);
    shards.length = 0; // Clear the array while keeping the reference
    shards.push(...(await res.json<ShardWithGuildCount[]>()));
  }

  onMount(async () => {
    await fetchShards();
  });

  async function guildSearchSubmit(
    e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ) {
    e.preventDefault();
    let formData = new FormData(e.currentTarget);
    let guildId = formData.get("guildId")?.toString().trim();

    if (guildId === undefined) {
      return;
    }

    if (guildId.length === 0) {
      filteredShards.length = 0; // Clear the filter
      return;
    } else if (!/^\d{17,19}$/.test(guildId)) {
      alert("Please enter a valid guild ID.");
      return;
    }

    const res = await fetch(`${apiHost}/api/shards/${guildId}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.log(
        "Failed to fetch shard for guild ID:",
        guildId,
        res.statusText,
      );
      return;
    }

    const shardInfo = await res.json<{ shard_id: number }[]>();
    filteredShards = shardInfo.map((info) => info.shard_id);
    console.log("Shard info for guild ID", guildId, shardInfo);
  }
</script>

<div>
  <h1>Bot Status</h1>
  <form onsubmit={guildSearchSubmit}>
    <input name="guildId" type="text" placeholder="Enter guild id" />
  </form>
</div>
<ul>
  {#each displayedShards as shard_info}
    <Shard {...shard_info} />
  {/each}
</ul>

<style lang="scss">
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 1rem;
    margin-bottom: 1rem;
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
    }
    form {
      width: 20rem;
      input {
        display: block;
        width: 100%;
        background-color: var(--color-secondary-200);
        border: 2px solid var(--color-secondary-300);
        border-radius: 0.25rem;
      }
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    gap: 1rem;
    box-sizing: border-box;
    padding: 1rem;
    width: 100%;
  }

  :global(html body.dark) div {
    input {
      background-color: var(--color-secondary-800);
      border: 2px solid var(--color-secondary-700);
    }
  }

  @media (max-width: 768px) {
    ul {
      justify-content: center;
    }
  }
  @media (max-width: 480px) {
    div {
      flex-direction: column;
      h1 {
        text-align: center;
        margin-bottom: 0.5rem;
      }
      form {
        width: 100%;
      }
    }
  }
</style>
