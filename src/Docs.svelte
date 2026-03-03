<script lang="ts">
import { defaultDoc, type NodeJSON } from "./lib/index.js";
import Editor from "./lib/editor.svelte";
import type { NextlintEditor } from "./lib/editor/index.js";

type Tab = "installation" | "api" | "examples";

let activeTab = $state<Tab>("installation");
let editor = $state<NextlintEditor | null>(null);
let content = $state<NodeJSON>(defaultDoc);

const codeInstall = `npm install sveltor`;

const codeUsage = `
<script>
  import { Editor, defaultDoc } from 'sveltor';
<\/script>

<Editor 
  bind:content={content} 
  onAsk={async (prompt) => {
    // Gọi AI API của bạn ở đây
    // Server trả về stream → insert vào editor
  }}
/>
`;

const codeProps = `
interface EditorProps {
  // Nội dung document (NodeJSON từ ProseKit)
  content: NodeJSON;
  
  // Callback khi editor được khởi tạo
  onCreated?: (editor: NextlintEditor) => void;
  
  // Callback khi user gửi prompt AI
  onAsk?: (prompt: string) => Promise<void>;
  
  // Chế độ readonly
  readonly?: boolean;
  
  // Placeholder text
  placeholder?: string;
}
`;

const examples = [
  {
    title: "AI Writing Assistant",
    description: "Nhập Space sau dấu cách để mở AI prompt",
    prompt: "Viết giới thiệu về Svelte",
  },
  {
    title: "Slash Commands",
    description: "Gõ / để mở menu chọn block",
  },
  {
    title: "Inline Formatting",
    description: "Chọn text để hiển thị menu định dạng",
  },
];
</script>

<div class="docs-container">
  <nav class="sidebar">
    <div class="logo">⚡ Sveltor</div>
    <button 
      class:active={activeTab === "installation"} 
      onclick={() => activeTab = "installation"}
    >
      Installation
    </button>
    <button 
      class:active={activeTab === "api"} 
      onclick={() => activeTab = "api"}
    >
      API Reference
    </button>
    <button 
      class:active={activeTab === "examples"} 
      onclick={() => activeTab = "examples"}
    >
      Examples
    </button>
  </nav>

  <main class="content">
    {#if activeTab === "installation"}
      <section class="docs-section">
        <h1>Installation</h1>
        <p>Cài đặt qua npm:</p>
        <pre><code>{codeInstall}</code></pre>
        
        <h2>Peer Dependencies</h2>
        <p>Cần cài thêm:</p>
        <pre><code>npm install svelte @lucide/svelte</code></pre>
      </section>
    
    {:else if activeTab === "api"}
      <section class="docs-section">
        <h1>API Reference</h1>
        
        <h2>Editor Props</h2>
        <pre><code>{codeProps}</code></pre>
        
        <h2>Types</h2>
        <pre><code>{`type NodeJSON = ProseKit.NodeJSON;
type NextlintEditor = Editor<EditorExtension>;`}</code></pre>
      </section>
    
    {:else if activeTab === "examples"}
      <section class="docs-section">
        <h1>Examples</h1>
        
        {#each examples as example}
          <div class="example-card">
            <h3>{example.title}</h3>
            <p>{example.description}</p>
          </div>
        {/each}
        
        <h2>Live Demo</h2>
        <div class="demo-container">
          <Editor
            onCreated={(e) => editor = e}
            bind:content={content}
            onAsk={async (prompt: string) => {
              console.log("AI Prompt:", prompt);
            }}
          />
        </div>
      </section>
    {/if}
  </main>
</div>

<style>
  .docs-container {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 240px;
    background: #1a1a2e;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 2rem;
  }

  .sidebar button {
    background: transparent;
    border: none;
    color: #888;
    padding: 0.75rem 1rem;
    text-align: left;
    cursor: pointer;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s;
  }

  .sidebar button:hover {
    background: #16213e;
    color: #fff;
  }

  .sidebar button.active {
    background: #0f3460;
    color: #fff;
  }

  .content {
    flex: 1;
    padding: 2rem 3rem;
    background: #fafafa;
    overflow-y: auto;
  }

  .docs-section h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #1a1a2e;
  }

  .docs-section h2 {
    font-size: 1.25rem;
    margin: 2rem 0 1rem;
    color: #333;
  }

  .docs-section p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  pre {
    background: #1a1a2e;
    color: #e0e0e0;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .example-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .example-card h3 {
    margin: 0 0 0.5rem;
    color: #1a1a2e;
  }

  .example-card p {
    margin: 0;
    color: #666;
  }

  .demo-container {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    min-height: 400px;
    padding: 1rem;
  }
</style>
