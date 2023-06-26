<script lang="ts">
  export let onClick: () => boolean;
</script>

<button on:click={onClick}>
  <slot />
</button>

<style lang="scss">
  button {
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    background-color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    color: #57627b;
    &:hover {
      background-color: #7b8fa1;
      color: white;
      transition-property: color, background-color;
      transition-duration: 300ms;
      transition-timing-function: linear, linear;
    }
    &.active {
      background-color: #567189;
    }
  }
</style>
