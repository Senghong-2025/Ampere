<template>
    <div class="w-full">
        <FormHeader title="Load Details" is-show-button>
            <template #button>
                <div class="flex gap-1">
                    <TheButton1 type="primary" :loading="isLoading" name="Reload" @click="getGeneratedLoadByMonth()" />
                    <TheButton1 type="primary" name="Export" :disabled="isLoading" @click="handleExport()" />
                    <TheButton1 type="primary" name="Share" :disabled="isLoading" @click="handleShare()" />
                </div>
            </template>
        </FormHeader>
        <div class="filter-form flex gap-2 items-end">
            <div class="flex h-full items-center gap-2 w-full">
                <label for="home">Home</label>
                <select id="home" v-model="selectedHome" class="w-full" @change="handleChange()">
                    <option v-for="(home, index) in homes" :key="index" :value="home">{{ home }}</option>
                </select>
            </div>
            <div class="flex items-center gap-2 w-full">
                <label for="date">Date</label>
                <input id="date" v-model="selectedDate" type="month" class="w-full" @change="handleChange()">
            </div>
            <TheButton1 type="primary" name="Delete" @click="onClickDelete(generatedLoad ?? {} as GenerateLoad)" />
        </div>
        <LoadDetailTable
            :is-loading="isLoading" 
            :generated-load="generatedLoad!"
            :is-show-action="true"
            @edit-load="editLoad"
        />
        <!-- <div class="w-full p-4">
            <div class="input-form">
                <label for="bankTransfer">Bank Transfer</label>
                <input v-model="updateModel.bankTransfer" type="number">
            </div>
        </div> -->
        <el-dialog
            v-model="dialogVisible"
            title="Update Load Details"
            width="350" 
            :show-close="false"
            :close-on-click-modal="false">
            <template #header>
                <div class="text-[16px] font-semibold text-center">Update Load Details</div>
            </template>
            <div class="text-red-600 bg-black/10 p-2 rounded-md mb-2 italic font-medium">
                <span>- Update load for: Room </span>
                <span class="text-blue-600 font-bold">{{ updateModel.roomNumber }}</span> <br>
                <span>- Total Amount For Pay: </span>
                <span class="text-blue-600 font-bold">{{ accountingWithoutRoundUp(totalAmountForPaid, 2) }}៛</span>
            </div>
            <div class="w-full flex flex-col gap-2">
                <div class="flex w-full items-center">
                    <label for="isPaid" class="w-[150px]">Is Paid</label>
                    <div class="flex justify-start">
                        <input
                        id="isPaid" v-model="updateModel.isPaid" type="checkbox"
                        @change="onSwitchChange">
                    </div>
                </div>

                <div class="flex w-full items-center">
                    <label for="paidAmount" class="w-[150px]">Paid Amount</label>
                    <input id="paidAmount" v-model="updateModel.paidAmount" type="number" class="w-auto" @input="onPaidAmountInput">
                </div>

                <div class="flex w-full items-center">
                    <label for="remark" class="w-[150px]">Remark</label>
                    <input id="remark" v-model="updateModel.remark" type="text" class="w-auto">
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
        <!-- Delete dialog -->
        <el-dialog
            v-model="isShowConfirm" title="Delete Load Details" width="350" :show-close="false"
        >
            <template #header>
                <div class="text-[12px] font-semibold"> Do you want to delete this load? </div>
            </template>
            <div class="flex justify-end gap-1 mt-2">
                <TheButton1 type="info" name="Cancel" @click="isShowConfirm = false" />
                <TheButton1 type="primary" name="Yes" :loading="isLoading" @click="onConfirmDelete" />
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '@/components/FormHeader.vue';
import LoadDetailTable from '@/components/loads/LoadDetailTable.vue';
import type { GenerateLoad } from '@/models/generateLoad';
import useLoadDetails from '@/composables/loads/useLoadDetails';
import CopyLink from '@/components/load/CopyLink.vue';
import { accountingWithoutRoundUp } from '~/helpers/textFormatHelper';

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
    onClickDelete,
    onConfirmDelete,
    isShowConfirm,
    totalAmountForPaid,
    getGeneratedLoadByMonth,
    onPaidAmountInput,
} = useLoadDetails();
</script>