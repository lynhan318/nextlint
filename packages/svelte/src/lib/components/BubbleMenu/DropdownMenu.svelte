<script lang="ts">
  import {Menu, Group, Box, Text} from '@svelteuidev/core';
  import {CaretDown, Check} from 'radix-icons-svelte';
  import {useEditor} from '@sveltor/core';
  import {onMount} from 'svelte';

  import {BubbleMenuDropdownList} from './constants';

  const editor = useEditor();
  let currentNode = BubbleMenuDropdownList[0];
  onMount(() => {
    $editor?.on('selectionUpdate', ({editor}) => {
      const sel = editor.view.state.selection;
      const resolver = editor.view.state.doc.resolve(sel.anchor);
      const node = resolver.node(1);
      if (node) {
        currentNode = BubbleMenuDropdownList.find(item => {
          if (node.type.name === 'heading') {
            return item.slug === `${node.type.name}${node.attrs.level}`;
          }
          return node.type.name === item.slug;
        });
      }
    });
  });
</script>

<Menu
  opened
  override={{
    display: 'flex'
  }}
>
  <Group
    spacing="xs"
    slot="control"
    override={{
      fontSize: '14px',
      fontWeight: 600,
      color: '$dark400',
      cursor: 'pointer',
      borderRadius: 4,
      '&:hover': {
        backgroundColor: '$gray100'
      }
    }}
  >
    <Group override={{padding: 4}}>
      <svelte:component
        this={currentNode?.icon}
        style="width: 24px; height: 24px"
      />
      <Text
        override={{
          fontFamily: 'var(--editor-font-heading)',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '$dark300'
        }}>{currentNode?.label}</Text
      >
      <CaretDown />
    </Group>
  </Group>
  {#each BubbleMenuDropdownList as item}
    <Menu.Item
      override={{
        fontSize: '14px',
        position: 'relative',
        fontWeight: 600,
        color: '$dark400',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: 4,
        '&:hover': {
          backgroundColor: '$gray100'
        }
      }}
      on:click={e => {
        e.stopPropagation();
        if (item.toggle($editor)) {
          currentNode = item;
        }
      }}
    >
      <Group
        override={{
          padding: 0
        }}
      >
        <svelte:component this={item.icon} style="width: 24px; height: 24px" />
        <Text
          override={{
            fontFamily: 'var(--editor-font-heading)',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '$dark300'
          }}
        >
          {item.label}
        </Text>
        {#if currentNode?.slug === item.slug}
          <Box css={{position: 'absolute', right: 4}}>
            <Check />
          </Box>
        {/if}
      </Group>
    </Menu.Item>
  {/each}
</Menu>
