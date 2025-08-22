<template>
    <div class="p-4">
        Setting
        <TheButton1 type="primary" name="Logout" @click="handleLogout"/>
    </div>
</template>
<script lang="ts" setup>

const router = useRouter();
const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.replace("/auth/login");
};
</script>