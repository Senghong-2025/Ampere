<template>
    <div>
        <button :class="buttonClasses" class="cursor-pointer" :disabled="loading" @click="$emit('click')">
            <div class="flex items-center gap-2">
                <svg
                    v-if="loading"
                    class="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
                <span>{{ loading ? 'Loading...' : name }}</span>
            </div>
        </button>
    </div>
</template>

<script lang="ts" setup>
type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'quaternary';

const props = defineProps<{
    name: string;
    type: ButtonType;
    loading?: boolean;
}>();

defineEmits<{
    (e: 'click'): void;
}>();

const buttonClasses = computed(() => {
    const baseClasses = 'px-4 py-2 rounded font-medium transition-colors duration-200';
    const typeClasses: Record<ButtonType, string> = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        tertiary: 'bg-red-800/70 text-white hover:bg-red-900',
        quaternary: 'bg-purple-500 text-white hover:bg-purple-600',
    };
    return `${baseClasses} ${typeClasses[props.type]}`;
});
</script>