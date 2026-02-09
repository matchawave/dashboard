<script lang="ts">
  import { page } from "$app/state";
  import { guildsState, userState } from "$state";
  import { Card, Search } from "flowbite-svelte";
  import Guild from "$components/guild.svelte";
  import { onMount } from "svelte";
  import Topbar from "$components/topbar.svelte";
  import Icon from "@iconify/svelte";

  const apiHost = $derived<string>(page.data.apiHost);
  const user = $derived(userState);

  let guildSearch = $state<string>("");
  const guildList = $derived.by(() => {
    let trimmedSearch = guildSearch.trim().toLowerCase();
    if (trimmedSearch.length == 0) return guildsState;
    return guildsState.filter((guild) =>
      guild.name.toLowerCase().includes(trimmedSearch),
    );
  });

  onMount(() => {});
</script>
