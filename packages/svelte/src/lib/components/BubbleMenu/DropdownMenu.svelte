<script lang="ts">
  import {Menu, Group, Box, Text} from '@svelteuidev/core';
  import type {Node as PMNode} from '@tiptap/pm/model';
  import {CaretDown, Check} from 'radix-icons-svelte';

  import {useEditor} from '$lib/context';

  import {BubbleMenuDropdownList} from './constants';

  const editor = useEditor();

  export let visibleNode: PMNode;

  const formatHeadingSlug = (visibleNode: PMNode) =>
    visibleNode.type.name === 'heading'
      ? visibleNode.type.name + visibleNode.attrs.level
      : visibleNode.type.name;

  $: currentNode =
    BubbleMenuDropdownList.find(
      item => item.type === formatHeadingSlug(visibleNode)
    ) || BubbleMenuDropdownList[0];
</script>

<Menu
  opened={false}
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
      <Text
        override={{
          fontFamily: 'var(--editor-font-heading)',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '$dark300'
        }}>{currentNode.label}</Text
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
        item.toggle($editor);
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
        {#if formatHeadingSlug(visibleNode) === item.type}
          <Box css={{position: 'absolute', right: 4}}>
            <Check />
          </Box>
        {/if}
      </Group>
    </Menu.Item>
  {/each}
</Menu>
