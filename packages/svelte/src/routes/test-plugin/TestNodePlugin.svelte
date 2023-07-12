<script lang="ts">
  import {useNodeViewProps, useContentRef} from '$lib/helpers';

  const props = useNodeViewProps();
  const contentRef = useContentRef();
</script>

<p use:contentRef>This is editable.</p>
