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

const downloadProgress = ref()
const downloadLoaded = ref()
const downloadTotal = ref()
const downloadData = async () => {
  await api.client.download('/test/download', { name: 'client download' }, {
    onProgress: async (progress: number, loaded: number, total: number) => {
      downloadProgress.value = progress
      downloadLoaded.value = loaded
      downloadTotal.value = total
    },
    filename: '你好 01.txt',
  })
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
          clientDownloadData: {{ downloadProgress }}/{{ downloadLoaded }}/{{ downloadTotal }}
        </span>
      </div>
    </div>
  </div>
</template>
