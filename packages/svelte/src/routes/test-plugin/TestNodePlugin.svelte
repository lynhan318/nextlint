<script lang="ts">
  import {useNodeViewProps, useContentRef} from '$lib/helpers';

  const props = useNodeViewProps();
  const contentRef = useContentRef();
</script>

<div>
  <p use:contentRef />
</div>
