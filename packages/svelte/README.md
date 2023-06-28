# Nextlint
Nextlint is a WYSIWYG (What You See Is What You Get) editor built using the "@tiptap" library and developed with Svelte. It provides a user-friendly interface for editing and formatting text, allowing users to create rich content effortlessly.
# Features

[x] Bubble Menu
[x] Slash Menu
[x] Image 
[x] GPT prompt
[ ] Block Menu (WIP)

... and many more.

# Demo:
https://nextlint-editor.vercel.app/

# Quick start

Install the package:
```sh
//npm
npm install @nextlint/svelte

//yarn
yarn add @nextlint/svelte

//pnmp 
npm add @nextlint/svelte
```
# Setup

```svelte
<script lang="ts">
  import {type Editor, EditorTheme, SvelteEditor} from '@nextlint/svelte';

  let editor: Editor;

  const submitPromt = async (prompt: string) => {
    // handle prompt for GPT plugin
    return '';
  };
  
  const handleUpload = async (file: File) => {
    // handle upload here
    const blob = new Blob([file]);
    const previewUrl = URL.createObjectURL(blob);
    return previewUrl;
  };
  
</script>

<EditorTheme>
  <SvelteEditor
    content={''}
    placeholder="Press 'space' GPT support, type '/' for help"
    onCreated={createdEditor => { editor = createdEditor }}
    onChange={nextEditor => { editor = nextEditor }}
    
    <!-- plugins config -->
    plugins={{
      selectImage: {
        handleUpload,
        unsplash: {
          accessKey: 'UNPLASH_API_KEY'
        }
      },
      gpt: {query: submitPromt}
    }}
    
  />
</EditorTheme>

```

