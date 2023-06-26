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
        <svelte:component this={icon} />
      </span>
    {/if}
    <span style="margin-left:16px">
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
    margin: 0;
    width: 100%;
    text-align: left;
    border-radius: 0.4rem;
    border: 1px solid transparent;
    height: 40px;
    padding: 0px 8px;
    cursor: pointer;
    &:hover {
      background-color: var(--svelteui-colors-gray300);
    }
    &.actived {
      background-color: var(--svelteui-colors-gray200);
    }
    .content {
      padding: 8px;
      .icon {
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        font-size: 0.9rem;
        text-transform: capitalize;
      }
    }
  }
</style>
