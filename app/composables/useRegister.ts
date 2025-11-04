import { createUserWithEmailAndPassword } from 'firebase/auth'
import type { UserCredential, AuthError } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

interface RegisterData {
  email: string
  password: string
  name: string
}

interface RegisterResponse {
  success: boolean
  error?: string
  user?: UserCredential
}

export default function useRegister() {
  const { $auth, $db } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    loading.value = true
    error.value = null

    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        data.email,
        data.password
      )

      // Create a user document in Firestore
      await setDoc(doc($db, 'users', userCredential.user.uid), {
        email: data.email,
        name: data.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user' // Default role
      })

      return {
        success: true,
        user: userCredential
      }
    } catch (e) {
      const firebaseError = e as AuthError
      error.value = translateFirebaseError(firebaseError?.code || 'auth/unknown')
      error.value = translateFirebaseError((e as { code?: string })?.code || 'auth/unknown')
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  const translateFirebaseError = (code: string): string => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      default:
        return 'An error occurred during registration'
    }
  }

  return {
    register,
    loading: readonly(loading),
    error: readonly(error)
  }
}