<template>
    <div class="p-4">
        <div class="fixed bottom-2 right-2">
            <TheButton1 type="primary" name="Logout" @click="handleLogout"/>
        </div>
    </div>
</template>
<script lang="ts" setup>

const router = useRouter();
const handleLogout = () => {
    useCookie("token").value = null;
    router.replace("/auth/login");
};
</script>