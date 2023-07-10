<svelte:options accessors={true} />

<script lang="ts">
  import {
    Stack,
    Box,
    Loader,
    Button,
    Center,
    Group,
    ActionIcon
  } from '@svelteuidev/core';

  import {Cross1} from 'radix-icons-svelte';
  import {getContext} from 'svelte';
  const options = getContext('options');

  let prompt = '';
  let submiting = false;
  let completion = '';
  let input: HTMLElement;

  export let onApply = (text: string) => {};
  export let onClose = () => {};

  // external access {{
  export const onShow = () => {
    requestAnimationFrame(() => input.focus());
  };

  export const onHide = () => {
    prompt = '';
    completion = '';
  };
  // }}

  export const clearData = () => {
    completion = '';
    prompt = '';
  };

  const onSubmit = async (e: any) => {
    if (submiting) return;
    submiting = true;
    e.preventDefault();
    completion = await options.query(prompt);
    submiting = false;
  };
</script>

<Box
  css={{
    backgroundColor: 'white',
    padding: 16,
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    zIndex: 1,
    width: 480,
    borderRadius: 8,
    position: 'absolute'
  }}
>
  <form on:submit={onSubmit}>
    <textarea
      class="input"
      bind:this={input}
      placeholder="Hi there! How can I help you?"
      bind:value={prompt}
      on:keypress={e => {
        if (e.key === 'Enter') {
          return onSubmit(e);
        }
      }}
    />
  </form>

  <Box css={{width: '100%'}}>
    {#if submiting}
      <Center override={{marginTop: 16, marginBottom: 8}}>
        <Loader color="teal" size="sm" />
      </Center>
    {:else if completion}
      <Stack>
        <textarea class="textarea" bind:value={completion} />

        <Group override={{flexWrap: 'wrap'}}>
          <Button
            override={{flex: 1}}
            on:click={clearData}
            variant="outline"
            color="gray"
            disabled={submiting}>Clear</Button
          >
          <Button
            override={{flex: 1}}
            color="teal"
            variant="outline"
            on:click={() => {
              onApply(completion);
              clearData();
            }}
            disabled={submiting}>Apply</Button
          >
        </Group>
      </Stack>
    {/if}
  </Box>
  <ActionIcon
    on:click={() => {
      onClose();
      clearData();
    }}
    override={{
      position: 'absolute',
      top: -16,
      right: -8,
      backgroundColor: 'white',
      borderRadius: 8,
      border: '1px solid var(--svelteui-colors-gray100)'
    }}
  >
    <Cross1 />
  </ActionIcon>
</Box>

<style lang="scss">
  .input {
    box-sizing: border-box;
    padding: 8px;
    width: 100%;
    outline: none;
    border: 1px solid var(--svelteui-colors-gray100);
    border-radius: 8px;
    transition: border-color 0.2s ease-in-out;
    &:focus-within {
      border-color: var(--svelteui-colors-gray300);
    }
    &::placeholder {
      font-size: 14px;
      line-height: 21px;
      color: var(--svelteui-colors-dark100);
    }
  }
  .textarea {
    box-sizing: border-box;
    resize: vertical;
    word-break: break-word;
    min-height: 180px;
    width: 100%;
    font-family: var(--font-editor);
    outline: none;
    border: 1px solid var(--svelteui-colors-gray100);
    padding: 8px;
    border-radius: 8px;
    margin-top: 16px;
    font-size: 15px;
    &:hover {
      border-color: var(--svelteui-colors-gray300);
    }
  }
</style>
