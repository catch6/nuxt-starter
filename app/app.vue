<script lang="ts">
import { ConfigProvider } from 'reka-ui'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <ConfigProvider locale="zh-CN">
    <TooltipProvider :delay-duration="1000">
      <NuxtLoadingIndicator color="#18181b" :throttle="0" />
      <NuxtLayout>
        <NuxtPage></NuxtPage>
      </NuxtLayout>
      <Toaster />
    </TooltipProvider>
  </ConfigProvider>
</template>
