<script lang="ts">
  import {Group} from '@svelteuidev/core';
  import {
    Bold,
    Strikethrough,
    Italic,
    Underline,
    Code,
    AlignLeft,
    AlignRight,
    AlignCenter
  } from 'lucide-svelte';
  import {onMount} from 'svelte';
  import {getRootNode, type TextAlignment} from '@nextlint/core';

  import {useEditor} from '$lib/context';
  import {cn} from '$lib/helpers';
  import {CommandButton} from '$lib/components';

  const editor = useEditor();

  $: isActive = (style: string): boolean => $editor!.isActive(style);

  $: hasAlign = (direction: string): boolean => {
    let align = '';
    const rootNode = getRootNode($editor!);
    if (rootNode) {
      const {node} = rootNode;
      align = node.attrs.align;
    }
    return align === direction;
  };

  const toggle = (style: string): boolean => {
    return $editor!.commands[`toggle${style}`]();
  };

  const setTextAlign = (direction: TextAlignment) => {
    $editor.chain().setTextAlign(direction).run();
  };

  $: renderer = [
    {
      label: 'Bold',
      cmd: 'Ctrl + B',
      toggle: () => toggle('Bold'),
      icon: Bold,
      active: isActive('bold')
    },
    {
      label: 'Italic',
      cmd: 'Ctrl + I',
      toggle: () => toggle('Italic'),
      icon: Italic,
      active: isActive('italic')
    },
    {
      label: 'Underline',
      cmd: 'Ctrl + U',
      toggle: () => toggle('Underline'),
      icon: Underline,
      active: isActive('underline')
    },
    {
      label: 'Code',
      toggle: () => toggle('Code'),
      icon: Code,
      active: isActive('code')
    },
    {
      label: 'Strike',
      cmd: 'Ctrl + Shift + x',
      toggle: () => toggle('Strike'),
      icon: Strikethrough,
      active: isActive('strike')
    },
    {
      label: 'Align Text Left',
      toggle: () => setTextAlign('left'),
      icon: AlignLeft,
      active: hasAlign('left')
    },
    {
      label: 'Align Text Center',
      toggle: () => setTextAlign('center'),
      icon: AlignCenter,
      active: hasAlign('center')
    },
    {
      label: 'Align Text Right',
      toggle: () => setTextAlign('right'),
      icon: AlignRight,
      active: hasAlign('right')
    }
  ];

  onMount(() => {
    $editor!.on('update', props => {
      editor.set(props.editor);
    });
    $editor!.on('selectionUpdate', props => {
      editor.set(props.editor);
    });
  });
</script>

<Group override={{gap: 4}}>
  {#each renderer as props}
    <CommandButton {...props}>
      <svelte:component
        this={props.icon}
        size={18}
        class={cn('text-muted-foreground', props.active && 'text-success')}
      />
    </CommandButton>
  {/each}
</Group>
