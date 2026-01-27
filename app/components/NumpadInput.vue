<template>
    <div class="input-form">
        <label :for="id">{{ label }}</label>
        <input
            v-if="isMobile" :id="id" :value="modelValue" :name="id" type="text" inputmode="none" readonly
            required class="cursor-pointer" @focus="onMobileFocus">
        <input
            v-else :id="id" :value="modelValue" :name="id" type="number" required
            @input="onNativeInput">

        <!-- Numpad overlay -->
        <Teleport to="body">
            <Transition name="numpad-backdrop">
                <div
                    v-if="isMobile && open"
                    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50"
                    @click.self="close">
                    <Transition name="numpad-panel" appear>
                        <div class="numpad-panel bg-[#0f1117] w-full max-w-[420px] rounded-t-2xl pb-6 pt-3 px-4">
                            <!-- Drag handle -->
                            <div class="flex justify-center mb-3">
                                <div class="w-10 h-1 rounded-full bg-gray-600" />
                            </div>

                            <!-- Display area -->
                            <div class="relative mb-4 px-4 py-4 bg-[#1a1d27] rounded-xl border border-gray-700/50">
                                <span class="block text-xs text-gray-500 uppercase tracking-wider mb-1">{{ label }}</span>
                                <div class="flex items-baseline justify-between">
                                    <span class="text-3xl font-semibold text-white tabular-nums tracking-tight">
                                        {{ display || '0' }}
                                    </span>
                                    <button
                                        v-if="display.length > 0" type="button"
                                        class="text-gray-500 hover:text-gray-300 transition-colors p-1"
                                        @click="clearAll">
                                        <span class="text-xs font-medium uppercase">Clear</span>
                                    </button>
                                </div>
                                <div class="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                            </div>

                            <!-- Keypad grid -->
                            <div class="grid grid-cols-3 gap-2.5">
                                <button
                                    v-for="key in numKeys" :key="key" type="button"
                                    class="numpad-key h-14 text-xl font-medium rounded-xl text-white border border-gray-700/40 bg-[#1e2130] active:scale-95 active:bg-[#282c3e] transition-all duration-100 select-none"
                                    @click="onKey(key)">
                                    {{ key }}
                                </button>

                                <!-- Decimal -->
                                <button
                                    type="button"
                                    class="numpad-key h-14 text-xl font-medium rounded-xl text-white border border-gray-700/40 bg-[#1e2130] active:scale-95 active:bg-[#282c3e] transition-all duration-100 select-none"
                                    @click="onKey('.')">
                                    .
                                </button>

                                <!-- Zero -->
                                <button
                                    type="button"
                                    class="numpad-key h-14 text-xl font-medium rounded-xl text-white border border-gray-700/40 bg-[#1e2130] active:scale-95 active:bg-[#282c3e] transition-all duration-100 select-none"
                                    @click="onKey('0')">
                                    0
                                </button>

                                <!-- Backspace -->
                                <button
                                    type="button"
                                    class="numpad-key h-14 text-xl font-medium rounded-xl text-white border border-red-800/30 bg-red-900/30 active:scale-95 active:bg-red-800/50 transition-all duration-100 select-none"
                                    @click="onKey('⌫')">
                                    ⌫
                                </button>
                            </div>

                            <!-- Confirm button -->
                            <button
                                type="button"
                                class="w-full mt-3 h-12 text-base font-semibold rounded-xl text-white bg-red-700 active:bg-red-800 active:scale-[0.98] transition-all duration-100 select-none uppercase tracking-wide"
                                @click="onKey('OK')">
                                Confirm
                            </button>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>
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

const numKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

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

function clearAll() {
    display.value = '';
    emit('update:modelValue', null);
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

<style scoped>
/* Slide-up panel animation */
.numpad-panel {
    box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.5);
}

.numpad-backdrop-enter-active,
.numpad-backdrop-leave-active {
    transition: opacity 0.25s ease;
}
.numpad-backdrop-enter-from,
.numpad-backdrop-leave-to {
    opacity: 0;
}

.numpad-panel-enter-active {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.numpad-panel-leave-active {
    transition: transform 0.2s ease-in;
}
.numpad-panel-enter-from,
.numpad-panel-leave-to {
    transform: translateY(100%);
}

/* Haptic-style press effect on keys */
.numpad-key:active {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
