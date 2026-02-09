<script lang="ts">
  import Icon from "@iconify/svelte";
  import { toggleDarkMode, darkModeState } from "$state";
  import Tooltip from "./tooltip.svelte";

  const darkMode = $derived.by(() => darkModeState.state);
  const icon = $derived.by(() =>
    darkModeState.state ? "line-md:sunny-filled" : "line-md:moon-filled",
  );
</script>

<Tooltip text={darkMode ? "Light Mode" : "Dark Mode"}>
  <button class="secondary btn" onclick={toggleDarkMode}>
    <Icon {icon} class="dark-icon" />
  </button>
</Tooltip>

<style lang="scss">
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    padding: 1rem;

    &:hover {
      transform: translateY(-0.25rem);
    }
    &:active {
      transform: translateY(-0.1225rem);
    }
  }
  .dark-icon {
    transition: color 0.15s ease-in-out;
    color: var(--color-primary-500);
    font-size: large;
    :global(body.dark) & {
      color: var(--color-primary-400);
    }
  }
</style>
