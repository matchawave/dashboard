<script lang="ts">
  import Icon from "@iconify/svelte";
  import Tooltip from "./tooltip.svelte";
</script>

<Tooltip text="Status">
  <a href="/status" class="btn secondary">
    <Icon icon="line-md:heart-twotone" />
  </a>
</Tooltip>

<style lang="scss">
  a {
    color: oklch(64.5% 0.246 16.439);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: large;
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-0.25rem);
    }
    &:active {
      transform: translateY(-0.1225rem);
    }
  }
</style>
