<style>
.app-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.editor-wrapper {
  max-width: 850px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 80vh;
}
</style>

<script lang="ts">
import Editor from "./lib/editor.svelte";
import type { NodeJSON, NextlintEditor } from "./lib/index.js";

const sampleContent: NodeJSON = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1, textAlign: "left" },
      content: [
        {
          type: "text",
          text: "Hướng Dẫn Phát Triển Web Hiện Đại Với Svelte Và ProseKit",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Trong bài viết này, chúng ta sẽ khám phá " },
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "cách xây dựng ứng dụng web hiện đại",
        },
        { type: "text", text: " sử dụng " },
        { type: "text", marks: [{ type: "italic" }], text: "Svelte" },
        { type: "text", text: " và " },
        { type: "text", marks: [{ type: "italic" }], text: "ProseKit" },
        {
          type: "text",
          text: ". Đây là hai công cụ mạnh mẽ giúp developers tạo ra những trải nghiệm người dùng tuyệt vời.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "Tổng Quan Về Công Nghệ" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Svelte là một " },
        {
          type: "text",
          marks: [{ type: "underline" }],
          text: "framework JavaScript",
        },
        { type: "text", text: " được biết đến với cách tiếp cận " },
        {
          type: "text",
          marks: [{ type: "bold" }, { type: "italic" }],
          text: "compiler-first",
        },
        {
          type: "text",
          text: ". Thay vì sử dụng Virtual DOM như React hay Vue, Svelte compile code của bạn thành vanilla JavaScript, giúp ứng dụng có hiệu suất cao hơn đáng kể.",
        },
      ],
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              marks: [{ type: "italic" }],
              text: "Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.",
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "Cài Đặt Môi Trường Phát Triển" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Để bắt đầu, bạn cần cài đặt Node.js và npm. Sau đó, sử dụng các lệnh sau để tạo project:",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "bash" },
      content: [
        {
          type: "text",
          text: "# Tạo project Svelte mới\nnpm create svelte@latest my-app\ncd my-app\nnpm install\n\n# Chạy development server\nnpm run dev",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Bạn cũng có thể sử dụng " },
        { type: "text", marks: [{ type: "code" }], text: "bun" },
        { type: "text", text: " thay cho npm để có tốc độ nhanh hơn:" },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "bash" },
      content: [
        {
          type: "text",
          text: "# Sử dụng Bun\nbun create svelte my-app\ncd my-app\nbun install\nbun run dev",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "Cấu Trúc Project" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Một project Svelte điển hình có cấu trúc như sau:",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "plaintext" },
      content: [
        {
          type: "text",
          text: "my-app/\n├── src/\n│   ├── lib/\n│   │   ├── components/\n│   │   └── stores/\n│   ├── routes/\n│   └── app.html\n├── static/\n├── package.json\n└── svelte.config.js",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "Các Tính Năng Chính" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "ProseKit cung cấp nhiều tính năng mạnh mẽ cho việc xây dựng text editor. Dưới đây là các tính năng quan trọng:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "• Rich Text Editing",
        },
        {
          type: "text",
          text: " - Hỗ trợ định dạng văn bản đa dạng với các marks như bold, italic, underline, strike, code",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "• Block Elements" },
        {
          type: "text",
          text: " - Heading, paragraph, blockquote, code block, lists",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "• Media Support" },
        { type: "text", text: " - Chèn hình ảnh, video với hỗ trợ caption" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "• Tables" },
        { type: "text", text: " - Tạo và chỉnh sửa bảng dễ dàng" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "• AI Integration" },
        { type: "text", text: " - Tích hợp AI để hỗ trợ viết lách thông minh" },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3, textAlign: "left" },
      content: [{ type: "text", text: "Ví Dụ Về Code" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Dưới đây là ví dụ về cách tạo một component đơn giản trong Svelte 5:",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "typescript" },
      content: [
        {
          type: "text",
          text: "interface Props {\n  name: string;\n  age?: number;\n}\n\nlet { name, age = 18 }: Props = $props();\n\nfunction greet() {\n  console.log(`Hello, ${name}! You are ${age} years old.`);\n}",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Code trên sử dụng " },
        { type: "text", marks: [{ type: "code" }], text: "$props()" },
        {
          type: "text",
          text: " rune mới trong Svelte 5 để handle props. Đây là cú pháp hiện đại thay thế cho ",
        },
        { type: "text", marks: [{ type: "code" }], text: "export let" },
        { type: "text", text: " trong các phiên bản trước." },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "Bảng So Sánh Framework" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Dưới đây là bảng so sánh các framework phổ biến:",
        },
      ],
    },
    {
      type: "table",
      attrs: { rows: 4, cols: 4 },
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Framework",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Virtual DOM",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Performance",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Learning Curve",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "table",
      attrs: { rows: 4, cols: 4 },
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "React" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "Có" }] },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "Tốt" }] },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Trung bình" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "table",
      attrs: { rows: 4, cols: 4 },
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "Vue" }] },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "Có" }] },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "Tốt" }] },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "Dễ" }] },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "table",
      attrs: { rows: 4, cols: 4 },
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Svelte" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Không" }],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Rất Tốt",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1 },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "Dễ" }] },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "horizontalRule",
      content: [],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "Hướng Dẫn Từng Bước" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Dưới đây là các bước để xây dựng một ứng dụng hoàn chỉnh:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "1. Thiết kế kiến trúc",
        },
        {
          type: "text",
          text: " - Xác định cấu trúc dữ liệu, components, và routing",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "2. Cài đặt dependencies",
        },
        {
          type: "text",
          text: " - Sử dụng npm hoặc bun để cài đặt các thư viện cần thiết",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "3. Phát triển components",
        },
        { type: "text", text: " - Tạo các UI components theo thiết kế" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "4. Tích hợp APIs" },
        { type: "text", text: " - Kết nối với backend services" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "5. Testing" },
        { type: "text", text: " - Viết unit tests và integration tests" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "6. Deploy" },
        { type: "text", text: " - Triển khai ứng dụng lên production" },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3, textAlign: "left" },
      content: [{ type: "text", text: "Task List Theo Dõi Tiến Độ" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Sử dụng task list để theo dõi các công việc (sử dụng slash command /task để tạo):",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "code" }], text: "[x]" },
        { type: "text", text: " Tạo repository và setup project" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "code" }], text: "[x]" },
        { type: "text", text: " Thiết kế UI/UX" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "code" }], text: "[ ]" },
        { type: "text", text: " Phát triển các tính năng chính" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "code" }], text: "[ ]" },
        { type: "text", text: " Viết tests" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "code" }], text: "[ ]" },
        { type: "text", text: " Deploy lên production" },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3, textAlign: "left" },
      content: [{ type: "text", text: "Các Tính Năng Nâng Cao" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "ProseKit hỗ trợ nhiều tính năng nâng cao khác như toggle list, nested lists, và nhiều hơn nữa. Sử dụng slash commands (/toggle) để truy cập nhanh các tính năng này.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "Kết Luận" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Svelte và ProseKit là một " },
        {
          type: "text",
          marks: [{ type: "underline" }],
          text: "sự kết hợp hoàn hảo",
        },
        { type: "text", text: " cho việc phát triển web hiện đại. Với " },
        { type: "text", marks: [{ type: "bold" }], text: "hiệu suất cao" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "bold" }], text: "API trực quan" },
        { type: "text", text: ", và " },
        { type: "text", marks: [{ type: "bold" }], text: "hỗ trợ AI" },
        {
          type: "text",
          text: ", bạn có thể xây dựng những ứng dụng web tuyệt vời một cách nhanh chóng.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Để tìm hiểu thêm, hãy truy cập " },
        {
          type: "text",
          marks: [{ type: "link", attrs: { href: "https://svelte.dev" } }],
          text: "svelte.dev",
        },
        { type: "text", text: " và " },
        {
          type: "text",
          marks: [{ type: "link", attrs: { href: "https://prosekit.dev" } }],
          text: "prosekit.dev",
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "italic" }],
          text: "Chúc bạn thành công trong hành trình phát triển web!",
        },
      ],
    },
  ],
};

let content = $state<NodeJSON>(sampleContent);
let editor = $state<NextlintEditor | null>(null);

const handleAsk = async (prompt: string) => {
  console.log("AI Prompt received:", prompt);
};
console.log("App initialized with sample content:", content);
</script>

<main class="app-container">
  <div class="editor-wrapper">
    <Editor
      bind:content={content}
      onCreated={(e) => (editor = e)}
      onAsk={handleAsk} />
  </div>
</main>
