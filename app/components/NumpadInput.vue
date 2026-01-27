<template>
    <div class="input-form">
        <label :for="id">{{ label }}</label>
        <input
            v-if="isMobile" :id="id" :value="modelValue" :name="id" type="text" inputmode="none" readonly
            required class="cursor-pointer" @focus="onMobileFocus">
        <input
            v-else :id="id" :value="modelValue" :name="id" type="number" required
            @input="onNativeInput">
        <div v-if="isMobile && open" class="fixed inset-0 bg-black/40 flex items-end justify-center z-50" @click.self="close">
            <div class="bg-gray-800 w-full max-w-[400px] rounded-t-xl p-4">
                <div class="flex justify-between items-center py-3 px-2 mb-3 bg-gray-900 rounded-lg text-white">
                    <span class="text-lg font-medium">{{ display || '0' }}</span>
                    <span class="text-xs text-gray-400">{{ label }}</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <button
                        v-for="key in keys" :key="key" type="button"
                        class="p-3.5 text-xl font-medium rounded-lg text-white border-none cursor-pointer transition-colors duration-150"
                        :class="key === '⌫' || key === 'OK' ? 'bg-red-600 active:bg-red-700' : 'bg-gray-700 active:bg-gray-600'"
                        @click="onKey(key)">
                        {{ key }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    modelValue: number | string | null
    label: string
    id: string
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number | null): void
}>();

const MOBILE_BREAKPOINT = 768;
const isMobile = ref(false);
const open = ref(false);
const display = ref('');

function checkMobile() {
    isMobile.value = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

onMounted(() => {
    checkMobile();
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
        .addEventListener('change', checkMobile);
});

onUnmounted(() => {
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
        .removeEventListener('change', checkMobile);
});

watch(() => props.modelValue, (val) => {
    display.value = val != null ? String(val) : '';
}, { immediate: true });

const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫', 'OK'];

function onKey(key: string) {
    if (key === 'OK') {
        close();
        return;
    }
    if (key === '⌫') {
        display.value = display.value.slice(0, -1);
    } else if (key === '.') {
        if (!display.value.includes('.')) {
            display.value += display.value === '' ? '0.' : '.';
        }
    } else {
        display.value += key;
    }
    const num = parseFloat(display.value);
    emit('update:modelValue', display.value === '' ? null : (isNaN(num) ? null : num));
}

function onMobileFocus(event: FocusEvent) {
    (event.target as HTMLInputElement).blur();
    open.value = true;
}

function onNativeInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    const num = parseFloat(val);
    emit('update:modelValue', val === '' ? null : (isNaN(num) ? null : num));
}

function close() {
    open.value = false;
}
</script>
