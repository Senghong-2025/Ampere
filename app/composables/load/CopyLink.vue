<template>
    <el-dialog v-model="model" title="Share Load Details" width="350" :show-close="false" @close="$emit('close')">
        <template #header>
            <div class="text-[12px] font-semibold">🔗 Share the Load Details </div>
        </template>
        <template #default>
            <div class="bg-gray-100 rounded-sm p-1 flex gap-1 items-center">
                <div class="text-[12px] text-blue-600">{{ shareUrl }}</div>
                <TheButton1 type="info" name="Copy" @click="handleCopy" />
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import notifyHelper from '~/helpers/notifyHelper';


const props = defineProps<{
    shareVisible: boolean;
    shareUrl: string;
}>();


const emit = defineEmits<{
    (e: 'update:shareVisible', val: boolean): void;
    (e: 'close'): void;
}>();

const model = computed({
    get: () => props.shareVisible,
    set: (val) => emit('update:shareVisible', val),
})

const handleCopy = () => {
    navigator.clipboard.writeText(props.shareUrl).then(() => {
        emit('close');
        notifyHelper.success("Copied")
    });
};
</script>