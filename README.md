# Nextlint

Rich text editor (WYSIWYG) written in Svelte, using [MeltUI](https://melt-ui.com/) headless UI and [tailwindcss](https://tailwindcss.com/) CSS framework.

Built on top of [tiptap](https://tiptap.dev/) editor(headless editor) and [prosemirror](https://prosemirror.net/). Easy to use, develop and maintain. A prompt engine that helps to integrate with any AI API, and enhance the writing experience. 

Dark/Light theme is supported and customizable. 

## Getting started

### Install

```sh
//npm
npm install @nextlint/svelte

//yarn
yarn add @nextlint/svelte

//pnmp
npm add @nextlint/svelte
```

### Setup
Nexltint editor uses headless svelte components from MeltUI and styles it with tailwindcss. The theme tokens are inherited from [Svelte Shadcn](https://www.shadcn-svelte.com/docs/theming).

If you already have shadcn setup in your project then you can skip this part.


#### 1. Install tailwindcss and postcss:

```sh
pnpm add -D tailwindcss postcss autoprefixer sass
npx tailwindcss init -p
```
Now `tailwind.config.js` and `postcss.config.js` are created

#### 2. Configure tailwind.config.js:

```js

// more detail at https://www.shadcn-svelte.com/docs/installation/manual

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{svelte,js}",
    "./node_modules/@nextlint/svelte/dist/**/*.{svelte,ts}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  plugins: [],
}
```
Theme can customize via css tokens. The default token is located at [EditorTheme.scss](https://github.com/sveltor/nextlint/blob/main/packages/svelte/src/lib/EditorTheme.scss).

### Usage:
To use the default theme, you need to wrap your `SvelteEditor` component with `ThemeTheme`:
```svelte
<script lang="ts">
  import { SvelteEditor, EditorTheme } from "@nextlint/svelte" 
</script>
  
<div class='editor'>
  <EditorTheme>
    <SvelteEditor 
      content=""
      placeholder="Start editing..."
    />
  </EditorTheme>
</div>
```

The `EditorTheme` basicaly just import the default theme we define in `EditorTheme.scss`:

```svelte

//EditorTheme.svelte

<script lang="ts">
  import './EditorTheme.scss';
</script>

<slot />
```

Nexltint editor uses `nextlint/core`, which is a headless editor with [existing](https://github.com/sveltor/nextlint/blob/main/packages/core/src/editor/starterKit.ts#L57) plugins installed, can be used in any UI framework, compatible with tiptap and prosemirror plugins system.

Nextlint Svelte itself has some [plugins](https://github.com/sveltor/nextlint/tree/main/packages/svelte/src/lib/plugins) completely written in Svelte and [configurable](https://github.com/sveltor/nextlint/blob/main/packages/svelte/src/lib/Editor.svelte#L2)

## Features

### Bubble Menu

![Bubble Menu](/source/bubble_menu.png)

### Slash Menu

![Slash Menu](/source/slash_menu.png)

### Image

Support upload/embed/unsplash api

![Image](/source/image.png)

### AI prompt

![GPT prompt](/source/gpt_prompt.png)

## Options

|                Name                |          Type           | Description                                             |
| :--------------------------------: | :---------------------: | :------------------------------------------------------ |
|     **[`content`](#content)**      |        `Content`        | Initialize editor content                               |
|    **[`onChange`](#onChange)**     | `(editor:Editor)=>void` | A callback will call when the editor change             |
| **[`placeholder?`](#placeholder)** |        `String`         | The placeholder will be displayed when the editor empty |
|   **[`onCreated?`](#onCreated)**   | `(editor:Editor)=>void` | A callback will trigger once when the editor is created |
|     **[`plugins?`](#plugins)**     |    `PluginsOptions`     | Customize plugins options                               |
|  **[`extensions?`](#extensions)**  |      `Extensions`       | Customize editor extension                              |


### content

Type: `HTMLContent | JSONContent | JSONContent[] | null`  

Initialize content, can be a JSONContent or a html markup.

```tsx
// Can be string
<SvelteEditor
  content="<p>this is a paragraph content</p>"
/>

// which is equal
<SvelteEditor
  ...
  content={{
    type:'docs'
    attrs:{},
    content:[{
      type:'paragraph',
      attrs:{},
      content:[{
        type:'text',
        text:'this is a paragraph content'
      }]
    }]
  }}
/>
```


### placeholder

Type: `String | undefined`
Default: `undefined`

Placeholder will display when editor content is empty

```svelte
<SvelteEditor
  ...
  content=""
  placeholder="Press 'space' to trigger AI prompt"
/>
```

### onChange

Type: `(editor: Editor)=>void`  

The callback will fire when the editor changes ( update state or selection )

```svelte
<script lang='ts'>
  let editor;
</script>
<SvelteEditor
  ...
  onChange={_editor=>{
      editor=_editor
  }}
/>
```

### onCreated

Type: `(editor: Editor)=>void | undefined`
Default: `undefined`

The callback will fire once the editor finishes initialize

```svelte

<SvelteEditor
  ...
  onCreated={editor=>{
      console.log("The editor is created and ready to use !")
  }}
/>

```

### plugins

Type: `PluginOptions | undefined`
Default: `undefined`

```ts
type PluginOptions = {
    image?: ImagePluginOptions;
    gpt?: AskOptions;
    dropCursor?: DropcursorOptions;
};

```

### plugins.image

Type: `ImagePluginOptions|undefined`
Default: `undefined`

Config the handleUpload function and setup API key to fetch images from unsplash

```svelte
<SvelteEditor
      ...
      plugins={
        image: {
          handleUpload:(file)=>{
            // handle upload here
                const blob = new Blob([file]);
                const previewUrl = URL.createObjectURL(blob);
                return previewUrl;
          },
          unsplash: {
            accessKey: 'UNPLASH_API_KEY'
          }
        },
      }
/>
```

### plugins.ask

Type:`AskOptions|undefined`
Default: `undefined`

Trigger prompt in an empty line, get the question from the editor, call the handle function via this config and append the result to the editor.
Allow to integrate with any AI out side the editor.

```svelte
<SvelteEditor
  ...
  plugins={
    ask: async (question:string)=>{
      // config any AI tool to get the result and return 
      // the result to the editor 
    }
  }
/>
```


### plugins.dropCursor

Type: `DropcursorOptions|undefined`
Default: `undefined`

Config dropCursor color/width/class.

```svelte
<SvelteEditor
  ...
  plugins={
    dropCursor: {
      width:'2px',
      color:'#000',
    }
  }
/>
```

## Contributing
Please follow the [contribute guideline](https://github.com/sveltor/nextlint/blob/main/CONTRIBUTING.md)
## License
The MIT License (MIT). Please see [License File](https://github.com/sveltor/nextlint/blob/main/LICENSE) for more information.
