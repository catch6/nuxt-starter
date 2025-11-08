export const useTokenStore = defineStore('token', {
  state: () => {
    const token = ref('abc')
    return { token }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
  },
  persist: true,
})
