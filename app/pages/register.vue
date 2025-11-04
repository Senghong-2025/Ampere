<script setup lang="ts">
import { ref } from 'vue'
import useRegister from '~/composables/useRegister'

definePageMeta({
  layout: 'auth'
})

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

interface FormErrors {
  email: string
  password: string
  confirmPassword: string
  name: string
}

const { register, loading, error } = useRegister()
const router = useRouter()

const form = ref<FormData>({
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
})

const formErrors = ref<FormErrors>({
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
})

const validateForm = () => {
  let isValid = true
  formErrors.value = {
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  }

  if (!form.value.email) {
    formErrors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    formErrors.value.email = 'Invalid email format'
    isValid = false
  }

  if (!form.value.name) {
    formErrors.value.name = 'Name is required'
    isValid = false
  }

  if (!form.value.password) {
    formErrors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 6) {
    formErrors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!form.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.value.password !== form.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const result = await register({
    email: form.value.email,
    password: form.value.password,
    name: form.value.name
  })

  if (result.success) {
    router.push('/auth/login')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="name" class="sr-only">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Full Name">
            <p v-if="formErrors.name" class="mt-1 text-xs text-red-500">{{ formErrors.name }}</p>
          </div>

          <div class="mb-4">
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address">
            <p v-if="formErrors.email" class="mt-1 text-xs text-red-500">{{ formErrors.email }}</p>
          </div>

          <div class="mb-4">
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password">
            <p v-if="formErrors.password" class="mt-1 text-xs text-red-500">{{ formErrors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="sr-only">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password">
            <p v-if="formErrors.confirmPassword" class="mt-1 text-xs text-red-500">{{ formErrors.confirmPassword }}</p>
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>