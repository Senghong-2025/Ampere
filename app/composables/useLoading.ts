import { ref } from 'vue'

const loadings = ref<Record<string, boolean>>({})

export const useLoading = () => {
    const startLoading = (key: string) => {
        loadings.value[key] = true
    }

    const stopLoading = (key: string) => {
        loadings.value[key] = false
    }

    const isLoading = (key: string) => {
        return loadings.value[key] ?? false
    }

    return {
        startLoading,
        stopLoading,
        isLoading,
    }
}

export default useLoading;