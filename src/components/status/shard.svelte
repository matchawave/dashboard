<script lang="ts">
  import type { ShardWithGuildCount } from "$lib/status";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";

  let { shard, status, latency, users, guilds, started }: ShardWithGuildCount =
    $props();

  let statusColor = $derived.by(() => {
    switch (status) {
      case "connected":
        return [
          "oklch(76.5% 0.177 163.223)",
          "oklch(69.6% 0.17 162.48)",
        ] as const;
      case "connecting":
      case "resuming":
      case "handshake":
        return [
          "oklch(79.5% 0.184 86.047)",
          "oklch(76.9% 0.188 70.08)",
        ] as const;
      case "offline":
      case "disconnected":
        return [
          "oklch(57.7% 0.245 27.325)",
          "oklch(50.5% 0.213 27.518)",
        ] as const;
      default:
        return [
          "oklch(27.4% 0.006 286.033)",
          "oklch(21.3% 0.005 285.3)",
        ] as const;
    }
  });

  let uptime = $state<string>(formatUptime(started));
  onMount(() => {
    setInterval(() => {
      uptime = formatUptime(started);
    }, 1000 * 60 /* 1 minute */);
  });

  function formatUptime(start: string | null): string {
    if (!start) return "N/A";
    // Since started is a UTC timestamp, we can use Date.now() which is also in UTC
    console.log("Started:", start);
    const startDate = new Date(start);
    const currentDate = new Date();
    console.log(start.toString(), "|", currentDate.toString());
    console.log(startDate, currentDate);
    const diff = currentDate.getTime() - startDate.getTime();
    console.log(currentDate.getTime(), startDate.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 99) return "99d+";
    if (Math.abs(days) < 1) return `${days}d`;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    if (Math.abs(hours) < 1) return `${hours}h`;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    console.log(minutes);
    if (Math.abs(minutes) < 1) return `${minutes}m`;
    return "Just now";
  }
  let latencyIcon = $derived.by(() => {
    if (latency === null)
      return "material-symbols--android-wifi-3-bar-off-rounded";
    if (latency < 100) return "material-symbols:android-wifi-3-bar-rounded";
    if (latency < 500)
      return "material-symbols:android-wifi-3-bar-alert-rounded";
    return "material-symbols:android-wifi-3-bar-question-rounded";
  });

  let users_count = $derived(users.toLocaleString("en-US"));

  interface ShardInfo {
    icon: string;
    label: string;
    value: string;
  }

  let shardInfoDatas: ShardInfo[] = $derived([
    {
      icon: "mdi:clock-time-four-outline",
      label: "Uptime",
      value: uptime,
    },
    {
      icon: latencyIcon,
      label: "Latency",
      value: latency !== null ? `${latency} ms` : "N/A",
    },
    {
      icon: "mdi:account-group-outline",
      label: "Users",
      value: users_count,
    },
    {
      icon: "mdi:server-outline",
      label: "Guilds",
      value: guilds.toString(),
    },
  ]);
</script>

<li>
  <header>
    <h2>Shard {shard}</h2>
    <span
      style="background: linear-gradient(90deg, {statusColor[0]}, {statusColor[1]}); color: white;"
    >
      <Icon icon="svg-spinners:pulse-multiple" class="pulse-icon" />
      {status}
    </span>
  </header>
  <main>
    {#each shardInfoDatas as { icon, label, value }}
      <div>
        <h6>{label}</h6>
        <p>
          <Icon {icon} />
          {value}
        </p>
      </div>
    {/each}
  </main>
</li>

<style lang="scss">
  li {
    background-color: var(--color-secondary-200);
    border: 2px solid var(--color-secondary-300);
    padding: 1rem;
    border-radius: 0.25rem;
    width: 100%;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 1rem;
      margin-top: 0.25rem;
      h2 {
        font-size: 1.25rem;
        font-weight: 600;
      }
      span {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 10rem;

        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
        cursor: default;
        transition: transform 0.2s ease-in-out;
        &:hover {
          transform: scale(1.025);
        }
      }
    }

    main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
      box-sizing: border-box;
      padding: 0 1rem 0.5rem 1rem;

      div {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: 0.5rem;

        h6 {
          font-size: 1rem;
          color: var(--color-secondary-600);
        }
        p {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 1.25rem;
          font-weight: 500;
        }
      }
    }
  }
  :global(html body.dark) li {
    background-color: var(--color-secondary-800);
    border: 2px solid var(--color-secondary-700);
  }

  :global(svg.pulse-icon) {
    animation-duration: 5s !important;
  }

  @media (min-width: 1200px) {
    li {
      flex: 1 1 250px;
      max-width: 30rem;
    }
  }

  @media (max-width: 1200px) {
    li {
      flex: 0 1 calc(50% - 0.5rem);
    }
  }

  @media (max-width: 768px) {
    li {
      flex: 0 1 calc(100% - 0.5rem);
    }
  }

  @media (max-width: 480px) {
    li {
      header {
        padding: 0 0.5rem;
        margin-top: 0.12rem;
        h2 {
          font-size: 1rem;
        }
        span {
          gap: 0.2rem;
          padding: 0.2rem 0.5rem;
          font-size: 0.7rem;
        }
      }

      main {
        padding: 0 0.5rem;
        div {
          gap: 0.2rem;

          h6 {
            font-size: 0.875rem;
          }
          p {
            gap: 0.12rem;
            font-size: 1rem;
            font-weight: 500;
          }
        }
      }
    }
  }
</style>
