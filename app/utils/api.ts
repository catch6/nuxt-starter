import type { NitroFetchOptions } from 'nitropack'
import type { UseFetchOptions } from 'nuxt/app'
import { toast } from 'vue-sonner'

// API 响应类型定义
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

//  SSR 请求
class ServerRequest {
  private request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    config?: UseFetchOptions<ApiResponse<T>>,
  ) {
    const tokenStore = useTokenStore()
    const runtimeConfig = useRuntimeConfig()

    // 合并配置
    const options: UseFetchOptions<ApiResponse<T>> = {
      method,
      baseURL: runtimeConfig.public.apiBase,
      key: `${method}-${url}-${JSON.stringify(data)}`,
      // 默认配置
      headers: {
        'Content-Type': 'application/json',
        ...(tokenStore.token ? { Authorization: `Bearer ${tokenStore.token}` } : {}),
        ...(config?.headers as Record<string, string>),
      },
      // GET 请求使用 params，其他使用 body
      ...(method === 'GET' ? { params: data } : { body: data }),
      // 自定义配置覆盖
      ...(config as UseFetchOptions<ApiResponse<T>>),
      // 错误处理
      onResponseError({ response }) {
        const error = response._data
        console.error(`API Error [${method} ${url}]:`, error)
        // 统一错误处理
        if (response.status === 401) {
          // Token 过期，清除并跳转登录
          tokenStore.setToken('')
          // if (import.meta.client) {
          //   navigateTo('/login')
          // }
        }
      },
    }
    return useFetch<ApiResponse<T>>(url, options)
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, data?: any, config?: UseFetchOptions<ApiResponse<T>>) {
    return this.request<T>('GET', url, data, config)
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: UseFetchOptions<ApiResponse<T>>) {
    return this.request<T>('POST', url, data, config)
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: UseFetchOptions<ApiResponse<T>>) {
    return this.request<T>('PUT', url, data, config)
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, data?: any, config?: UseFetchOptions<ApiResponse<T>>) {
    return this.request<T>('DELETE', url, data, config)
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: UseFetchOptions<ApiResponse<T>>) {
    return this.request<T>('PATCH', url, data, config)
  }
}

class ClientRequest {
  private request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    config?: NitroFetchOptions<any>,
  ) {
    const tokenStore = useTokenStore()
    const runtimeConfig = useRuntimeConfig()

    // 合并配置
    const options: NitroFetchOptions<any> = {
      method,
      baseURL: runtimeConfig.public.apiBase,
      // 默认配置
      headers: {
        'Content-Type': 'application/json',
        ...(tokenStore.token ? { Authorization: `Bearer ${tokenStore.token}` } : {}),
        ...(config?.headers as Record<string, string>),
      },
      // GET 请求使用 params，其他使用 body
      ...(method === 'GET' ? { params: data } : { body: data }),
      // 自定义配置覆盖
      ...(config as NitroFetchOptions<any>),
      // 错误处理
      onResponseError({ response }) {
        const error = response._data
        console.error(`API Error [${method} ${url}]:`, error)
        // 统一错误处理
        if (response.status === 401) {
          // Token 过期，清除并跳转登录
          tokenStore.setToken('')
          // if (import.meta.client) {
          //   navigateTo('/login')
          // }
        }
      },
    }
    return $fetch<ApiResponse<T>>(url, options)
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, data?: any, config?: NitroFetchOptions<any>) {
    return this.request<T>('GET', url, data, config)
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: NitroFetchOptions<any>) {
    return this.request<T>('POST', url, data, config)
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: NitroFetchOptions<any>) {
    return this.request<T>('PUT', url, data, config)
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, data?: any, config?: NitroFetchOptions<any>) {
    return this.request<T>('DELETE', url, data, config)
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: NitroFetchOptions<any>) {
    return this.request<T>('PATCH', url, data, config)
  }

  /**
   * 文件上传
   * @param url 上传地址
   * @param file 文件对象或 File 数组
   * @param config 额外配置
   * @param onProgress 上传进度回调
   * @param fieldName 文件字段名，默认 'file'
   */
  async upload<T = any>(
    url: string,
    file: File | File[] | { file: File | File[], [key: string]: any },
    config?: NitroFetchOptions<any> & {
      onProgress?: (progress: number, loaded: number, total: number) => void
      fieldName?: string // 文件字段名，默认 'file'
    },
  ) {
    const formData = new FormData()

    // 处理文件参数
    if (file instanceof File) {
      formData.append(config?.fieldName || 'file', file)
    }
    else if (Array.isArray(file)) {
      file.forEach((f, index) => {
        formData.append(`${config?.fieldName || 'file'}[${index}]`, f)
      })
    }
    else {
      // 对象形式：{ file: File, name: 'xxx', ... }
      const { file: fileData, ...otherData } = file
      if (fileData instanceof File) {
        formData.append(config?.fieldName || 'file', fileData)
      }
      else if (Array.isArray(fileData)) {
        fileData.forEach((f, index) => {
          formData.append(`${config?.fieldName || 'file'}[${index}]`, f)
        })
      }
      // 添加其他字段
      Object.keys(otherData).forEach((key) => {
        formData.append(key, otherData[key])
      })
    }

    // 使用 XMLHttpRequest 实现进度跟踪
    if (config?.onProgress) {
      const tokenStore = useTokenStore()
      const runtimeConfig = useRuntimeConfig()

      return new Promise<ApiResponse<T>>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            config.onProgress?.(progress, e.loaded, e.total)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            }
            // eslint-disable-next-line unused-imports/no-unused-vars
            catch (error) {
              reject(new Error('解析响应失败'))
            }
          }
          else {
            reject(new Error(`上传失败: ${xhr.status}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('网络错误'))
        })

        xhr.open('POST', `${runtimeConfig.public.apiBase}${url}`)

        if (tokenStore.token) {
          xhr.setRequestHeader('Authorization', `Bearer ${tokenStore.token}`)
        }

        xhr.send(formData)
      })
    }

    // 不需要进度时使用 $fetch
    return this.request<T>('POST', url, formData, config)
  }

  /**
   * 文件下载
   * @param url 下载地址
   * @param data 查询参数
   * @param filename 下载文件名
   */
  async download(
    url: string,
    data?: any,
    config?: Partial<NitroFetchOptions<any>> & {
      filename?: string
    },
  ) {
    const response: any = await this.request<Blob>('GET', url, data, {
      responseType: 'blob',
      ...config,
    })
    this.downloadBlob(response, config?.filename)
  }

  /**
   * 通过 Blob 触发浏览器下载
   */
  private downloadBlob(blob: Blob, filename?: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || ''
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 延迟 revoke，确保下载已开始
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }
}

const api = {
  server: new ServerRequest(),
  client: new ClientRequest(),
}

export default api
