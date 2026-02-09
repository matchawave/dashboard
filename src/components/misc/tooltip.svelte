<script lang="ts">
  import type { Snippet } from "svelte";

  const { children, text }: { children: Snippet; text: string } = $props();
</script>

<div class="tooltip-wrapper">
  <div class="tooltip-content">
    {@render children()}
  </div>
  <span>{text}</span>
</div>

<style lang="scss">
  :global(body.dark) .tooltip-wrapper span {
    background-color: var(--color-secondary-700);
    border: 1px solid var(--color-secondary-900);
  }

  .tooltip-wrapper {
    position: relative;
    span {
      position: absolute;
      z-index: 20;
      top: -0.1rem;
      left: 50%;
      padding: 0.1rem 0.75rem;
      border-radius: 0.25rem;
      background-color: var(--color-secondary-300);
      border: 1px solid var(--color-secondary-500);
      transform: translate(-50%, -100%);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    &:hover {
      span {
        animation: swing-in-bottom-bck 0.6s
          cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
      }
    }
  }

  @keyframes swing-in-bottom-bck {
    0% {
      transform: rotateX(-70deg) translate(-50%, -100%);
      transform-origin: bottom;
      opacity: 0;
      visibility: hidden;
    }
    100% {
      transform: rotateX(0) translate(-50%, -100%);
      transform-origin: bottom;
      opacity: 1;
      visibility: visible;
    }
  }
</style>
