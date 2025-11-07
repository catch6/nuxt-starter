export const useTokenStore = defineStore('token', {
  state: () => {
    const token = ref('')
    return { token }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
  },
  persist: true,
})
