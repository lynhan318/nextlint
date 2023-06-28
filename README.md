# Nextlint
Nextlint is a WYSIWYG (What You See Is What You Get) editor built using the "@tiptap" library and developed with Svelte. It provides a user-friendly interface for editing and formatting text, allowing users to create rich content effortlessly.

- 💻 **Easy-to-use:** The editor provides a simple and intuitive interface, making it easy for users to create and edit content without any technical knowledge.
- ✍️ **Rich Text Editing:** Users can format text using various styles such as bold, italic, underline, headings, lists, and more.
- 🧱 **Extensible:** You can extend the editor's functionality by adding or creating custom extensions, allowing you to integrate additional features or customize the behavior of the editor.
- 🧠 **Integrate openAI,GPT functionality:** Unlocking the Power of Creative and Swift Writing with OpenAI and GPT Support.

# Features

### Bubble Menu
![Bubble Menu](/source/bubble_menu.png)

### Slash Menu
![Slash Menu](/source/slash_menu.png)

### Image 
Support upload/embed/unsplash api

![Image](/source/image.png)

### GPT prompt

![GPT prompt](/source/gpt_prompt.png)

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

