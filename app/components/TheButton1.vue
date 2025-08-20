<template>
    <div>
        <button
            :class="buttonClasses"
            class="cursor-pointer"
            @click="$emit('click')"
        >
            {{ name }}
        </button>
    </div>
</template>

<script lang="ts" setup>
type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'quaternary';

const props = defineProps<{
    name: string;
    type: ButtonType;
}>();

defineEmits<{
    (e: 'click'): void;
}>();

const buttonClasses = computed(() => {
    const baseClasses = 'px-4 py-2 rounded font-medium transition-colors duration-200';
    const typeClasses: Record<ButtonType, string> = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        tertiary: 'bg-green-500 text-white hover:bg-green-600',
        quaternary: 'bg-purple-500 text-white hover:bg-purple-600',
    };
    return `${baseClasses} ${typeClasses[props.type]}`;
});
</script>