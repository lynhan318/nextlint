<script lang="ts">
  import {Box, Button, ActionIcon, Container} from '@svelteuidev/core';
  import {LinkBreak2, Check} from 'radix-icons-svelte';
  import type {LinkProps} from './tiptap-link-v2';
  import type {Editor} from '@tiptap/core';

  // PreviewModal init via svelte component constructor,
  // it's not in svelte context
  // cannot use useEditor here
  export let editor: Editor;
  export let onHide = () => {};
  export let linkProps: LinkProps;

  let input: HTMLInputElement;
  const useInput = (inputEle: HTMLInputElement) => {
    input = inputEle;
    input.value = linkProps.mark.attrs.href;
    input.focus();
  };
  const onSubmit = e => {
    e.preventDefault();
    const {pos, node} = linkProps;
    if (
      editor
        .chain()
        .setTextSelection({
          from: pos,
          to: pos + node.textContent.length
        })
        .setLink({
          href: input.value
        })
        .scrollIntoView()
        .run()
    ) {
      onHide();
    }
  };
  const unsetLink = e => {
    e.preventDefault();
    const {pos, node} = linkProps;
    if (
      editor
        .chain()
        .setTextSelection({
          from: pos,
          to: pos + node.textContent.length + 1
        })
        .unsetLink()
        .scrollIntoView()
        .run()
    ) {
      onHide();
    }
  };
</script>

<Container override={{padding: 16}}>
  <Box
    css={{
      padding: 4,
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
        padding: '0 8px',
        '& input': {
          outline: 'none',
          border: 'none',
          padding: '4px 8px'
        }
      }}
      root="form"
    >
      <input
        placeholder="Link..."
        use:useInput
        value={linkProps.mark.attrs.href}
      />
      <Button
        variant="subtle"
        color="teal"
        type="submit"
        on:click={onSubmit}
        override={{width: 32, height: 32, padding: 0, cursor: 'pointer'}}
      >
        <Check size={20} />
      </Button>
      <ActionIcon
        on:mousedown={unsetLink}
        override={{
          width: 32,
          height: 32,
          padding: 0,
          cursor: 'pointer',
          color: '$red500'
        }}
      >
        <LinkBreak2 size={20} />
      </ActionIcon>
    </Box>
  </Box>
</Container>
