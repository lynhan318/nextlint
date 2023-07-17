<script lang="ts">
  import type {ComponentType} from 'svelte';

  export let text = '';
  export let icon: ComponentType | null = null;
  export let active = false;
  export let onClick = () => {};
</script>

<button on:click={onClick} class="wrapper" class:actived={active}>
  <div class="content">
    {#if icon}
      <span class="icon">
        <svelte:component this={icon} size={24} />
      </span>
    {/if}
    <span style="margin-left:48px">
      {text}
    </span>
  </div>
</button>

<!-- markup (zero or more items) goes here -->
<style lang="scss">
  .wrapper {
    font-family: var(--editor-font-heading);
    font-weight: 500;
    color: var(--svelteui-colors-dark300);
    background-color: #fff;
    transition: background-color 0.15s ease-in;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    border-radius: 0.4rem;
    border: 1px solid transparent;
    margin-bottom: 4px;
    cursor: pointer;
    &:hover {
      background-color: var(--svelteui-colors-gray300);
    }
    &.actived {
      background-color: var(--svelteui-colors-gray200);
    }
    .content {
      .icon {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        font-size: 1.2rem;
        text-transform: capitalize;
      }
    }
  }
</style>
