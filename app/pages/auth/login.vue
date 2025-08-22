<template>
    <div class="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-400 to-blue-800">
        <div class="bg-gray-300 w-[350px] rounded-sm p-4">
            <div class="text-xl font-bold text-center mb-2">Access as Admin Account</div>
            <div class="input-form">
                <label for="key" star="yes">KEY 🔐</label>
                <input id="key" v-model="key" type="text" placeholder="Please input the access key">
            </div>
            <div class="flex justify-end mr-2">
                <TheButton1 type="primary" name="Submit" @click="handleClick()" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import notifyHelper from '~/helpers/notifyHelper';

const config = useRuntimeConfig();
definePageMeta({
    layout: 'auth'
});

const key = ref("");
const isLoading = ref(false);
const handleClick = async () => {
    if (key.value !== config.public.TOKEN_KEY) {
        notifyHelper.error("Invalid access key");
        return;
    }
    isLoading.value = true;
    sessionStorage.setItem("token", key.value);
    await new Promise(resolve => setTimeout(resolve, 100));
    navigateTo("/");
    isLoading.value = false;
};
</script>