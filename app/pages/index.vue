<script lang="ts" setup>
</script>

<template>
  <div>
    <span class=""></span>
    <Icon name="lucide:a-large-small"></Icon>
    <Button>你好 Hello</Button>
    <Button
      variant="outline" @click="() => {
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        })
      }"
    >
      Add to calendar
    </Button>
  </div>
</template>
