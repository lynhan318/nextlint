# Nextlint

Rich text editor (WYSIWYG) written in Svelte, using [MeltUI](https://melt-ui.com/) headless UI and [tailwindcss](https://tailwindcss.com/) CSS framework, built on top of tiptap editor(headless editor). Easy to use, develop and maintain. A prompt engine that helps to integrate with any AI API, and enhance the writing experience. 

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

## Editor Configuration

## Contributing
Please follow the [contribute guideline](https://github.com/sveltor/nextlint/blob/main/CONTRIBUTING.md)
## License
The MIT License (MIT). Please see [License File](https://github.com/sveltor/nextlint/blob/main/LICENSE) for more information.
