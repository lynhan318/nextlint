<script lang="ts">
  import {Tabs, Container, Input, Button, Text} from '@svelteuidev/core';

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

<Container override={{height: '100px'}}>
  <Button
    on:click={() => input.click()}
    size="xs"
    disabled={uploading}
    override={{width: '100%', margin: '16px 0'}}
    variant="outline">Upload</Button
  >
  <Input
    type="file"
    style="display:none"
    bind:element={input}
    on:change={onFileChange}
  />
  <Text size="sm" align="center" my="8px">Max upload size: 5MB</Text>
</Container>
