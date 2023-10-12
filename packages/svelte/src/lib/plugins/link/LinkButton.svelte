<script lang="ts">
  import {ActionIcon, Button, Input, Popper, Box} from '@svelteuidev/core';
  import {Link2, Check} from 'radix-icons-svelte';
  import {getMarkAttributes} from '@tiptap/core';
  import CommandButton from '$lib/components/CommandButton.svelte';
  import {getContext} from 'svelte';

  import type {PositionStore} from '$lib/components/Positioner';
  import {useEditor} from '$lib/context';

  const editor = useEditor();
  const positioner = getContext('positioner');

  let input: HTMLInputElement;
  let createLinkModal = false;
  let element: HTMLElement;

  positioner?.subscribe((value: PositionStore) => {
    if (!value.selection) {
      createLinkModal = false;
    }
  });

  $: mark = getMarkAttributes($editor!.state, 'link');

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (
      $editor!
        .chain()
        .focus()
        .setLink({
          href: input.value
        })
        .run()
    ) {
      createLinkModal = false;

      setTimeout(() => {
        input.value = '';
      }, 100);
    }
  };
</script>

<CommandButton
  label="Add Link"
  bind:element
  active={!!mark.href}
  toggle={() => {
    createLinkModal = !createLinkModal;
    requestAnimationFrame(() => {
      input.focus();
    });
  }}
>
  <Link2 size={20} />
</CommandButton>
<div bind:this={element}>
  <slot
    active={!!mark.href}
    toggle={() => {
      createLinkModal = !createLinkModal;
      requestAnimationFrame(() => {
        input.focus();
      });
    }}
  />
</div>
<Popper reference={element} mounted={createLinkModal} override={{padding: 8}}>
  <Box
    css={{
      backgroundColor: 'white',
      borderRadius: 4,
      boxShadow:
        'rgb(223, 225, 230) 0px 4px 8px, rgb(223, 225, 230) 0px 0px 1px'
    }}
  >
    <Box
      css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}
      root="form"
      on:submit={onSubmit}
    >
      <Box
        root="span"
        css={{
          paddingLeft: '12px',
          color: '$dark300',
          textAlign: 'right'
        }}>https://</Box
      >
      <Input
        placeholder="Link..."
        variant="unstyled"
        override={{width: 200}}
        value={(mark || {}).href || ''}
        bind:element={input}
      />
      <Button
        variant="subtle"
        type="submit"
        color="teal"
        override={{padding: 0, width: 28, height: 28}}
      >
        <Check size={20} />
      </Button>
    </Box>
  </Box>
</Popper>
