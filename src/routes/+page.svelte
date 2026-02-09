<script lang="ts">
  import { Button } from "flowbite-svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
  const apiHost = $derived(data.apiHost);
  import { guildsState, socketConnection } from "$state";
  import { onMount } from "svelte";

  onMount(() => {
    // Ensure guildsState is initialized
    guildsState.length = 0;
    socketConnection.disconnect();
  });
</script>

<main class="flex flex-col items-center justify-center h-screen">
  <form method="GET" action="{apiHost}/api/auth/login">
    <button class="primary btn" type="submit">Login to Discord</button>
  </form>
  <a href="/dashboard">Dashboard</a>
</main>

<style lang="scss">
  main {
    gap: 1.5rem;
    button {
      padding: 0.75rem 1.5rem;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-0.25rem);
      }
      &:active {
        transform: translateY(-0.1225rem);
      }
    }
  }
</style>
