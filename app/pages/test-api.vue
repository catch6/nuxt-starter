<script lang="ts" setup>
const { data: serverGetData } = await api.server.get('/test/get', { name: 'server get' })
const { data: serverPostData } = await api.server.post('/test/post', { name: 'server post' })
const { data: serverPutData } = await api.server.put('/test/put', { name: 'server put' })
const { data: serverDeleteData } = await api.server.delete('/test/delete', { name: 'server delete' })
const { data: serverPatchData } = await api.server.patch('/test/patch', { name: 'server patch' })

const clientGetData = ref()
const getData = async () => {
  const { data } = await api.client.get('/test/get', { name: 'client get' })
  clientGetData.value = data
}

const clientPostData = ref()
const postData = async () => {
  const { data } = await api.client.post('/test/post', { name: 'client post' })
  clientPostData.value = data
}

const clientPutData = ref()
const putData = async () => {
  const { data } = await api.client.put('/test/put', { name: 'client put' })
  clientPutData.value = data
}

const clientDeleteData = ref()
const deleteData = async () => {
  const { data } = await api.client.delete('/test/delete', { name: 'client delete' })
  clientDeleteData.value = data
}

const clientPatchData = ref()
const patchData = async () => {
  const { data } = await api.client.patch('/test/patch', { name: 'client patch' })
  clientPatchData.value = data
}

const downloadData = async () => {
  await api.client.download('/test/download', { name: 'client download' }, {
    filename: '你好 01.txt',
  })
}

const uploadProgress = ref(0)
const uploadLoaded = ref(0)
const uploadTotal = ref(0)
const selectedFile = ref<File | null>(null)
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}
const uploadData = async () => {
  if (!selectedFile.value) {
    return
  }
  try {
    await api.client.upload('/test/upload', { file: selectedFile.value, name: 'client upload' }, {
      onProgress: (progress: number, loaded: number, total: number) => {
        uploadProgress.value = progress
        uploadLoaded.value = loaded
        uploadTotal.value = total
      },
    })
    selectedFile.value = null
    // 重置文件输入
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput)
      fileInput.value = ''
  }
  catch (error) {
    console.error('上传失败:', error)
  }
}
</script>

<template>
  <div>
    <div>
      Server
      <p>serverGetData: {{ serverGetData }}</p>
      <p>serverPostData: {{ serverPostData }}</p>
      <p>serverPutData: {{ serverPutData }}</p>
      <p>serverDeleteData: {{ serverDeleteData }}</p>
      <p>serverPatchData: {{ serverPatchData }}</p>
    </div>
    <hr>
    <div>
      Client
      <div>
        <span @click="getData">
          clientGetData: {{ clientGetData }}
        </span>
      </div>
      <div>
        <span @click="postData">
          clientPostData: {{ clientPostData }}
        </span>
      </div>
      <div>
        <span @click="putData">
          clientPutData: {{ clientPutData }}
        </span>
      </div>
      <div>
        <span @click="deleteData">
          clientDeleteData: {{ clientDeleteData }}
        </span>
      </div>
      <div>
        <span @click="patchData">
          clientPatchData: {{ clientPatchData }}
        </span>
      </div>
      <div>
        <span @click="downloadData">
          clientDownloadData
        </span>
      </div>
      <div>
        <input type="file" @change="handleFileChange" />
        <span @click="uploadData">
          clientUploadData: {{ `${uploadProgress}/${uploadLoaded}/${uploadTotal}` }}
        </span>
      </div>
    </div>
  </div>
</template>
