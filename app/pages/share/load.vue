<template>
    <div class="w-full">
        <FormHeader :title="`ថ្លៃភ្លើងកុដិលេខ: ${selectedHome}`" is-show-button>
            <template #button>
                <div class="flex gap-1">
                    <TheButton1 type="primary" :loading="isLoading" name="Reload" @click="getGeneratedLoadByMonth()" />
                    <TheButton1 type="primary" name="Export" @click="handleExport()" />
                    <TheButton1 type="primary" name="Share" :disabled="isLoading" @click="handleShare()" />
                </div>
            </template>
        </FormHeader>
        <div class="filter-form flex gap-2">
            <div class="flex items-center gap-2 w-full">
                <label for="home" class="w-[20px]">កុដិ</label>
                <select id="home" v-model="selectedHome" class="w-full" @change="handleChange()">
                    <option v-for="(home, index) in homes" :key="index" :value="home">{{ 'កុដិលេខ' + home }}</option>
                </select>
            </div>
            <div class="flex items-center gap-2 w-full">
                <label for="date" class="w-[80px]">កាលបរិច្ឆេទ</label>
                <input id="date" v-model="selectedDate" type="month" class="w-full" @change="handleChange()">
            </div>
        </div>
        <LoadDetailTable :is-loading="isLoading" :generated-load="generatedLoad!" :is-show-action="false"/>
        <CopyLink :share-visible="shareVisible" :share-url="shareUrl" @close="shareVisible = false" @open="handleOpenLink" />
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '@/components/FormHeader.vue';
import CopyLink from '@/components/load/CopyLink.vue';
import LoadDetailTable from '@/components/loads/LoadDetailTable.vue';
import useLoadDetails from '@/composables/loads/useLoadDetails';

definePageMeta({
    layout: 'share'
})
const {
    selectedDate,
    selectedHome,
    homes,
    getGeneratedLoadByMonth,
    generatedLoad,
    isLoading,
    handleExport,
    handleChange,
    shareUrl,
    shareVisible,
    handleShare,
    handleOpenLink,
} = useLoadDetails();

onMounted(() => getGeneratedLoadByMonth());
</script>