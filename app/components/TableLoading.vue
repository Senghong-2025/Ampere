<template>
    <tr v-for="(room, index) in row" :key="index">
        <td v-for="(col, index2) in column" :key="index2" class="px-4">
            <div class="w-16 animate-pulse rounded bg-gray-200 h-[20px]" />
        </td>
    </tr>
</template>
<script lang="ts" setup>
defineProps<{
    row: number,
    column: number
}>();
</script>