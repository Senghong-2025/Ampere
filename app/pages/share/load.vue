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
                <label for="home" class="w-[80px]">ជ្រើសរើសកុដិ</label>
                <select id="home" v-model="selectedHome" class="w-full" @change="handleChange()">
                    <option v-for="home in homes" :key="home" :value="home">{{ 'កុដិលេខ' + home }}</option>
                </select>
            </div>
            <div class="flex items-center gap-2 w-full">
                <label for="date" class="w-[80px]">កាលបរិច្ឆេទ</label>
                <input id="date" v-model="selectedDate" type="month" class="w-full" @change="handleChange()">
            </div>
        </div>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md mt-2 min-h-[200px]" style="max-height: calc(100vh - 230px)">
            <table class="!min-w-[1200px]">
                <thead class="sticky top-0 z-10 bg-white">
                    <tr>
                        <th width="60" class="sticky left-0 bg-gray-200">បន្ទប់</th>
                        <th width="100">ខែចាស់(KW)</th>
                        <th width="100">បច្ចុប្បន្ន(KW)</th>
                        <th width="100">ប្រើអស់(KW)</th>
                        <th width="100">ថ្លៃភ្លើង</th>
                        <th width="80">សម្រាម</th>
                        <th width="125">ចំនួនបានបង់</th>
                        <th width="120">សរុប</th>
                        <th width="100">បានបង់ប្រាក់</th>
                        <th>ចំណា</th>
                    </tr>
                </thead>
                <tbody>
                    <TableLoading v-if="isLoading" :row="10" :column="10" />
                    <tr 
                        v-for="(room, index) in generatedLoad?.data" v-else :key="index"
                        :class="{ 'bg-gray-100 font-semibold': isTotalRow(index) }">
                        <td align="center" class="!text-blue-500 font-semibold sticky left-0  bg-gray-100">
                            <span> {{ isTotalRow(index) ? 'Total' : room.roomNumber }}</span>
                        </td>
                        <td :align="isTotalRow(index) ? 'center' : 'left'" :colspan="isTotalRow(index) ? 2 : 1">{{
                            isTotalRow(index) ? '--' : room.previousMonthKWForDisplay }}</td>
                        <td align="left" :hidden="isTotalRow(index)">{{ room.currentMonthKWForDisplay }}</td>
                        <td align="left" class="!text-red-600">{{ room.usageDifferenceForDisplay }}</td>
                        <td align="right">{{ room.usageAmountForDisplay }}</td>
                        <td align="center">{{ room.extraAmountByRoomForDisplay }}</td>
                        <td align="right">{{ room.paidAmountForDisplay }}</td>
                        <td
                            align="right" class="font-semibold"
                            :class="!isTotalRow(index) ? `${getStatusClass(room)} !text-white` : '!text-blue-500'">
                            {{ room.totalAmountForDisplay }}
                        </td>
                        <td align="center">
                            <span v-if="isTotalRow(index)" class="text-blue-500">{{ room.isPaid ? 'Completed' : '--' }}</span>
                            <span v-else :class="room.isPaidForDisplay.color">{{ room.isPaidForDisplay.text }}</span>
                        </td>
                        <td>{{ room.remark }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <CopyLink :share-visible="shareVisible" :share-url="shareUrl" @close="shareVisible = false" @open="handleOpenLink" />
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '@/components/FormHeader.vue';
import CopyLink from '@/composables/load/CopyLink.vue';
import type { GenerateLoadData } from '~/models/generateLoad';

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

const getStatusClass = (room: GenerateLoadData) => {
    if (room.isPaid) return '!bg-green-600'
    if (!room.isPaid && (room.paidAmount ?? 0) > 0) return '!bg-yellow-500'
    return '!bg-red-300'
};
const isTotalRow = (index: number) => {
    return generatedLoad.value?.data && index === generatedLoad.value.data.length - 1;
};
</script>