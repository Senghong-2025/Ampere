<template>
    <div class="w-full">
        <FormHeader title="Load Details" is-show-button>
            <template #button>
                <div class="flex gap-1">
                    <TheButton1 type="primary" :loading="isLoading" name="Reload" @click="handleChange()" />
                    <TheButton1 type="primary" name="Export" :disabled="isLoading" @click="handleExport()" />
                    <TheButton1 type="primary" name="Share" :disabled="isLoading" @click="handleShare()" />
                </div>
            </template>
        </FormHeader>
        <div class="filter-form flex gap-2">
            <div class="flex items-center gap-2 w-full">
                <label for="home">Home</label>
                <select id="home" v-model="selectedHome" class="w-full" @change="handleChange()">
                    <option v-for="home in homes" :key="home" :value="home">{{ home }}</option>
                </select>
            </div>
            <div class="flex items-center gap-2 w-full">
                <label for="date">Date</label>
                <input id="date" v-model="selectedDate" type="month" class="w-full" @change="handleChange()">
            </div>
        </div>
        <LoadDetailTable
            :is-loading="isLoading" 
            :generated-load="generatedLoad ?? {} as GenerateLoad"
            :is-show-action="true"
            @edit-load="editLoad"
        />
        <el-dialog
            v-model="dialogVisible"
            title="Update Load Details"
            width="350" 
            :show-close="false"
            :close-on-click-modal="false">
            <template #header>
                <div class="text-[16px] font-semibold text-center">Update Load Details</div>
            </template>
            <div class="text-gray-500 bg-gray-100 p-2 rounded-md mb-2">
                <span>Update load for:</span>
                <span class="text-blue-600 font-bold">{{ updateModel.roomNumber }}</span>
            </div>
            <div class="w-full space-y-2">
                <div class="flex w-full items-center">
                    <label for="isPaid" class="w-[150px]">Is Paid</label>
                    <input id="isPaid" v-model="updateModel.isPaid" type="checkbox" class="flex-1"
                        @change="onSwitchChange">
                </div>

                <div class="flex w-full items-center">
                    <label for="paidAmount" class="w-[150px]">Paid Amount</label>
                    <input id="paidAmount" v-model="updateModel.paidAmount" type="number" class="flex-1">
                </div>

                <div class="flex w-full items-center">
                    <label for="remark" class="w-[150px]">Remark</label>
                    <input id="remark" v-model="updateModel.remark" type="text" class="flex-1">
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer flex gap-1 justify-end">
                    <TheButton1 type="info" name="Cancel" @click="dialogVisible = false" />
                    <TheButton1 type="primary" name="Update" :loading="isUpdating" @click="onUpdate" />
                </div>
            </template>
        </el-dialog>
        <CopyLink :share-visible="shareVisible" :share-url="shareUrl" @close="shareVisible = false" @open="handleOpenLink" />
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '@/components/FormHeader.vue';
import CopyLink from '@/composables/load/CopyLink.vue';
import LoadDetailTable from '@/components/loads/LoadDetailTable.vue';
import type { GenerateLoad } from '~/models/generateLoad';

const {
    selectedDate,
    selectedHome,
    homes,
    generatedLoad,
    isLoading,
    onUpdate,
    dialogVisible,
    updateModel,
    onSwitchChange,
    handleExport,
    isUpdating,
    handleShare,
    handleChange,
    shareVisible,
    shareUrl,
    handleOpenLink,
    editLoad,
} = useLoadDetails();
</script>