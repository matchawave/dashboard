<script lang="ts">
  import "../app.css";
  import {} from "$state";
  import { onMount } from "svelte";
  import { DarkMode } from "flowbite-svelte";
  import Icon from "@iconify/svelte";
  import type { LayoutProps } from "./$types";
  import DarkModeSwitcher from "$components/misc/dark_mode_switcher.svelte";
  import { darkModeState, toggleDarkMode } from "$state";
  import StatusPage from "$components/misc/status_page.svelte";

  let { children, data }: LayoutProps = $props();
  const apiHost = $derived(data.apiHost);

  onMount(() => {
    let savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      darkModeState.state = true;
    } else if (savedTheme === "false") {
      darkModeState.state = false;
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      console.log("User prefers dark mode:", prefersDark);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });

  $effect(() => {
    document.body.classList.toggle("dark", darkModeState.state);

    // Save user preference
    localStorage.setItem("darkMode", darkModeState.state.toString());
  });

  const handleChange = (e: MediaQueryListEvent) => {
    // Only update if user hasn't manually set a preference
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === null) {
      darkModeState.state = e.matches;
    }
  };
</script>

{@render children()}
<div id="extra-ui-elements">
  <StatusPage />
  <DarkModeSwitcher />
</div>

<style lang="scss">
  :global(html body) {
    background-color: var(--color-secondary-100);
    color: var(--color-secondary-950);

    :global(a.btn) {
      text-decoration: none;
      padding: 0.75rem 0.75rem;
      border-radius: 0.25rem;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      cursor: pointer;
    }
    :global(button.btn) {
      border-radius: 0.25rem;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      cursor: pointer;
    }

    :global(button.primary) {
      background: linear-gradient(
        to bottom,
        var(--color-primary-200),
        var(--color-primary-300)
      );
    }
    :global(button.secondary) {
      background: linear-gradient(
        to bottom,
        var(--color-secondary-200),
        var(--color-secondary-300)
      );
    }
    :global(a.btn.secondary) {
      background: linear-gradient(
        to bottom,
        var(--color-secondary-200),
        var(--color-secondary-300)
      );
    }

    :global(a.btn.primary) {
      background: linear-gradient(
        to bottom,
        var(--color-primary-200),
        var(--color-primary-300)
      );
    }
  }

  :global(html body.dark) {
    background-color: var(--color-secondary-900);
    color: var(--color-secondary-50);

    :global(button.primary) {
      background: linear-gradient(
        to bottom,
        var(--color-primary-800),
        var(--color-primary-900)
      );
    }
    :global(button.secondary) {
      background: linear-gradient(
        to bottom,
        var(--color-secondary-800),
        var(--color-secondary-900)
      );
    }
    :global(a.btn.secondary) {
      background: linear-gradient(
        to bottom,
        var(--color-secondary-800),
        var(--color-secondary-900)
      );
    }
    :global(a.btn.primary) {
      background: linear-gradient(
        to bottom,
        var(--color-primary-800),
        var(--color-primary-900)
      );
    }
  }

  div {
    view-transition-name: extra-ui-elements;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 10;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
</style>
