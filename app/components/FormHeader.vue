<template>
    <div class="w-full bg-red-800 rounded-sm items-center flex justify-between mb-2 py-4 px-2 text-gray-100">
        <div>
            <h2 class="text-xl font-semibold">{{ title }}</h2>
        </div>
        <div v-if="isShowButton" class="ml-4 bg-gray-100 h-full rounded-sm">
            <slot name="button" />
        </div>
    </div>
</template>
<script lang="ts" setup>

defineProps<{
    title: string;
    isShowButton?: boolean;
}>();
</script>