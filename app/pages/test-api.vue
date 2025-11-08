<script lang="ts" setup>
import api from '~/utils/api'

// 页面标题
useHead({
  title: 'API 测试页面',
})

// 响应式数据
const loading = ref(false)
const results = ref<any[]>([])
const tokenStore = useTokenStore()

// 测试配置
const testConfig = reactive({
  baseURL: '',
  endpoint: '/test',
  method: 'GET' as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  requestData: '',
  token: '',
  useServer: false,
})

// 文件上传配置
const uploadConfig = reactive({
  file: null as File | null,
  progress: 0,
  withProgress: false,
})

// 文件下载配置
const downloadConfig = reactive({
  url: '/download',
  filename: '',
  withProgress: false,
  progress: 0,
})

// 添加测试结果
const addResult = (type: string, data: any, success = true) => {
  results.value.unshift({
    id: Date.now(),
    type,
    data,
    success,
    timestamp: new Date().toLocaleTimeString(),
  })
  if (results.value.length > 10) {
    results.value.pop()
  }
}

// 清除结果
const clearResults = () => {
  results.value = []
}

// 基础API测试
const testBasicAPI = async () => {
  loading.value = true
  try {
    const requestApi = testConfig.useServer ? api.server : api.client
    const requestData = testConfig.requestData ? JSON.parse(testConfig.requestData) : undefined

    let response
    switch (testConfig.method) {
      case 'GET':
        response = await requestApi.get(testConfig.endpoint, requestData)
        break
      case 'POST':
        response = await requestApi.post(testConfig.endpoint, requestData)
        break
      case 'PUT':
        response = await requestApi.put(testConfig.endpoint, requestData)
        break
      case 'DELETE':
        response = await requestApi.delete(testConfig.endpoint, requestData)
        break
      case 'PATCH':
        response = await requestApi.patch(testConfig.endpoint, requestData)
        break
    }

    addResult(`${testConfig.method} ${testConfig.endpoint}`, response, true)
    console.log('请求成功')
  }
  catch (error: any) {
    addResult(`${testConfig.method} ${testConfig.endpoint}`, error.message, false)
    console.error('请求失败')
  }
  finally {
    loading.value = false
  }
}

// 设置Token
const setToken = () => {
  tokenStore.setToken(testConfig.token)
  console.log('Token已设置')
}

// 清除Token
const clearToken = () => {
  tokenStore.setToken('')
  testConfig.token = ''
  console.log('Token已清除')
}

// 文件选择
const selectFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadConfig.file = target.files[0] || null
  }
}

// 文件上传测试
const testUpload = async () => {
  if (!uploadConfig.file) {
    console.error('请选择文件')
    return
  }

  loading.value = true
  uploadConfig.progress = 0

  try {
    const config = uploadConfig.withProgress
      ? {
          onProgress: (progress: number) => {
            uploadConfig.progress = progress
          },
        }
      : undefined

    const response = await api.client.upload('/upload', uploadConfig.file, config)
    addResult('文件上传', response, true)
    console.log('上传成功')
  }
  catch (error: any) {
    addResult('文件上传', error.message, false)
    console.error('上传失败')
  }
  finally {
    loading.value = false
    uploadConfig.progress = 0
  }
}

// 文件下载测试
const testDownload = async () => {
  loading.value = true
  downloadConfig.progress = 0

  try {
    const config = downloadConfig.withProgress
      ? {
          onProgress: (progress: number) => {
            downloadConfig.progress = progress
          },
          filename: downloadConfig.filename || undefined,
        }
      : {
          filename: downloadConfig.filename || undefined,
        }

    await api.client.download(downloadConfig.url, undefined, config)
    addResult('文件下载', { url: downloadConfig.url, filename: downloadConfig.filename }, true)
    console.log('下载成功')
  }
  catch (error: any) {
    addResult('文件下载', error.message, false)
    console.error('下载失败')
  }
  finally {
    loading.value = false
    downloadConfig.progress = 0
  }
}

// 批量测试
const runBatchTests = async () => {
  loading.value = true
  const tests = [
    { method: 'GET', endpoint: '/users', data: { page: 1, limit: 10 } },
    { method: 'POST', endpoint: '/users', data: { name: '测试用户', email: 'test@example.com' } },
    { method: 'PUT', endpoint: '/users/1', data: { name: '更新用户' } },
    { method: 'DELETE', endpoint: '/users/1', data: null },
    { method: 'PATCH', endpoint: '/users/1/status', data: { status: 'active' } },
  ]

  for (const test of tests) {
    try {
      const response = await api.client.get(test.endpoint, test.data)
      addResult(`批量-${test.method} ${test.endpoint}`, response, true)
    }
    catch (error: any) {
      addResult(`批量-${test.method} ${test.endpoint}`, error.message, false)
    }
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  loading.value = false
  console.log('批量测试完成')
}

// 当前Token状态
const currentToken = computed(() => tokenStore.token)
</script>

<template>
  <div class="container mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">
        API 测试页面
      </h1>
      <p class="text-muted-foreground">
        测试所有API功能，包括客户端/服务端请求、文件上传下载等
      </p>
    </div>

    <!-- Token管理 -->
    <div class="bg-card rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">
        Token 管理
      </h2>
      <div class="flex gap-4 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-2">当前Token</label>
          <div class="p-2 bg-muted rounded text-sm font-mono">
            {{ currentToken || '未设置' }}
          </div>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium mb-2">设置Token</label>
          <input
            v-model="testConfig.token"
            type="text"
            placeholder="输入Bearer Token"
            class="w-full p-2 border rounded-md"
          >
        </div>
        <button class="btn btn-primary" @click="setToken">
          设置Token
        </button>
        <button class="btn btn-secondary" @click="clearToken">
          清除Token
        </button>
      </div>
    </div>

    <!-- 基础API测试 -->
    <div class="bg-card rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">
        基础API测试
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">请求方式</label>
          <select v-model="testConfig.method" class="w-full p-2 border rounded-md">
            <option value="GET">
              GET
            </option>
            <option value="POST">
              POST
            </option>
            <option value="PUT">
              PUT
            </option>
            <option value="DELETE">
              DELETE
            </option>
            <option value="PATCH">
              PATCH
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">接口地址</label>
          <input
            v-model="testConfig.endpoint"
            type="text"
            placeholder="/api/endpoint"
            class="w-full p-2 border rounded-md"
          >
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">请求类型</label>
          <select v-model="testConfig.useServer" class="w-full p-2 border rounded-md">
            <option :value="false">
              客户端请求
            </option>
            <option :value="true">
              服务端请求
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium mb-2">请求数据 (JSON格式)</label>
        <textarea
          v-model="testConfig.requestData"
          placeholder="{&quot;key&quot;: &quot;value&quot;}"
          class="w-full p-2 border rounded-md h-24 font-mono text-sm"
        ></textarea>
      </div>
      <div class="mt-4 flex gap-4">
        <button :disabled="loading" class="btn btn-primary" @click="testBasicAPI">
          {{ loading ? '请求中...' : '发送请求' }}
        </button>
        <button :disabled="loading" class="btn btn-secondary" @click="runBatchTests">
          {{ loading ? '测试中...' : '批量测试' }}
        </button>
      </div>
    </div>

    <!-- 文件上传测试 -->
    <div class="bg-card rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">
        文件上传测试
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">选择文件</label>
          <input type="file" class="w-full p-2 border rounded-md" @change="selectFile">
        </div>
        <div v-if="uploadConfig.file" class="text-sm text-muted-foreground">
          已选择: {{ uploadConfig.file.name }} ({{ (uploadConfig.file.size / 1024).toFixed(2) }} KB)
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2">
            <input v-model="uploadConfig.withProgress" type="checkbox" class="rounded">
            <span class="text-sm">显示上传进度</span>
          </label>
        </div>
        <div v-if="uploadConfig.withProgress && uploadConfig.progress > 0" class="w-full">
          <div class="bg-muted rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${uploadConfig.progress}%` }"
            ></div>
          </div>
          <div class="text-sm text-muted-foreground mt-1">
            {{ uploadConfig.progress }}%
          </div>
        </div>
        <button
          :disabled="loading || !uploadConfig.file"
          class="btn btn-primary"
          @click="testUpload"
        >
          {{ loading ? '上传中...' : '开始上传' }}
        </button>
      </div>
    </div>

    <!-- 文件下载测试 -->
    <div class="bg-card rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">
        文件下载测试
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">下载地址</label>
          <input
            v-model="downloadConfig.url"
            type="text"
            placeholder="/download/file.pdf"
            class="w-full p-2 border rounded-md"
          >
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">文件名 (可选)</label>
          <input
            v-model="downloadConfig.filename"
            type="text"
            placeholder="自定义文件名"
            class="w-full p-2 border rounded-md"
          >
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2">
            <input v-model="downloadConfig.withProgress" type="checkbox" class="rounded">
            <span class="text-sm">显示下载进度</span>
          </label>
        </div>
        <div v-if="downloadConfig.withProgress && downloadConfig.progress > 0" class="w-full">
          <div class="bg-muted rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${downloadConfig.progress}%` }"
            ></div>
          </div>
          <div class="text-sm text-muted-foreground mt-1">
            {{ downloadConfig.progress }}%
          </div>
        </div>
        <button
          :disabled="loading"
          class="btn btn-primary"
          @click="testDownload"
        >
          {{ loading ? '下载中...' : '开始下载' }}
        </button>
      </div>
    </div>

    <!-- 测试结果 -->
    <div class="bg-card rounded-lg p-6 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          测试结果
        </h2>
        <button class="btn btn-secondary btn-sm" @click="clearResults">
          清除结果
        </button>
      </div>
      <div class="space-y-2 max-h-96 overflow-y-auto">
        <div v-if="results.length === 0" class="text-center text-muted-foreground py-8">
          暂无测试结果
        </div>
        <div
          v-for="result in results"
          :key="result.id"
          class="p-3 rounded-md border"
          :class="result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
        >
          <div class="flex justify-between items-start mb-2">
            <span class="font-medium text-sm">{{ result.type }}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground">{{ result.timestamp }}</span>
              <span
                class="px-2 py-1 text-xs rounded"
                :class="result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ result.success ? '成功' : '失败' }}
              </span>
            </div>
          </div>
          <pre class="text-xs bg-white p-2 rounded border overflow-x-auto whitespace-pre-wrap">{{ JSON.stringify(result.data, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  padding: 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: colors;
  outline: none;
  box-shadow: 0 0 0 2px transparent;
}

.btn:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}

.btn-primary:hover {
  background-color: var(--color-primary);
  opacity: 0.9;
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-secondary-foreground);
}

.btn-secondary:hover {
  background-color: var(--color-secondary);
  opacity: 0.8;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>
