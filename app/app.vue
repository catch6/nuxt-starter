<script lang="ts" setup>
import 'vue-sonner/style.css'
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NuxtLoadingIndicator color="#18181b" :throttle="0" />
    <Toaster />
  </TooltipProvider>
</template>
