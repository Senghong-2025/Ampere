interface RegisterData {
  email: string
  password: string
  name: string
}

interface RegisteredUser {
  id: string
  email: string
  name: string
  role: string
}

interface RegisterResponse {
  success: boolean
  error?: string
  user?: RegisteredUser
}

export default function useRegister() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    loading.value = true
    error.value = null

    try {
      const user = await $fetch<RegisteredUser>('/api/users/register', {
        method: 'POST',
        body: data,
      })

      return {
        success: true,
        user,
      }
    } catch (e) {
      error.value = translateRegistrationError(e)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  const translateRegistrationError = (e: unknown): string => {
    const response = e as { statusCode?: number, statusMessage?: string, data?: { statusMessage?: string } }
    if (response.statusCode === 409) return 'This email is already registered'
    if (response.statusCode === 400) return 'Invalid registration details'
    if (response.data?.statusMessage) return response.data.statusMessage
    if (response.statusMessage) return response.statusMessage

    return 'An error occurred during registration'
    }

  return {
    register,
    loading: readonly(loading),
    error: readonly(error)
  }
}
