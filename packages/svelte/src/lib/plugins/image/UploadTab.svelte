<script lang="ts">
  export let onInsert = (url: string, alt: string) => {};

  export let onUploadFile = async (file: File) => {
    return '';
  };

  let input: HTMLInputElement;
  let uploading = false;

  const onFileChange = async e => {
    if (uploading) return;
    const [file] = e.target.files;
    if (!file) return;
    uploading = true;

    const previewUrl = await onUploadFile(file);
    uploading = false;
    onInsert(previewUrl, file.name);
  };
</script>

<div class="flex w-full h-full">
  <button
    on:click={() => input.click()}
    disabled={uploading}
    class="w-full bg-slate-100 hover:bg-slate-200/80 transition-all rounded-md"
  >
    <span class="block">Max upload size: 5MB</span>
  </button>
  <input
    type="file"
    style="display:none"
    bind:this={input}
    on:change={onFileChange}
  />
</div>
