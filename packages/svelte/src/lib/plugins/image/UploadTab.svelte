<script lang="ts">

  let { onInsert = (url: string, alt: string) => {}, onUploadFile = async (file: File) => {
    return '';
  } } = $props();

  let input: HTMLInputElement = $state();
  let uploading = $state(false);

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
    onclick={() => input.click()}
    disabled={uploading}
    class="w-full bg-secondary transition-all rounded-md"
  >
    <span class="block">Max upload size: 5MB</span>
  </button>
  <input
    type="file"
    style="display:none"
    bind:this={input}
    onchange={onFileChange}
  />
</div>
