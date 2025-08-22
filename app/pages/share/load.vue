<template>
    <div class="w-full">
        <FormHeader title="Load Details" is-show-button>
            <template #button>
                <div class="flex gap-2">
                    <TheButton1 type="primary" :loading="isLoading" name="Reload Data"
                        @click="getGeneratedLoadByMonth()" />
                    <TheButton1 type="primary" name="Export" @click="handleExport()" />
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
        <div class="overflow-x-auto bg-white rounded-lg shadow-md mt-2 min-h-[200px]">
            <table class="!min-w-[1200px]">
                <thead>
                    <tr>
                        <th width="60" class="sticky left-0 bg-gray-200">Room</th>
                        <th width="120">Previous KW</th>
                        <th width="120">Current KW</th>
                        <th width="100">Usage</th>
                        <th width="140">Usage Amount</th>
                        <th width="120">Extra</th>
                        <th width="80" align="center">Is Paid</th>
                        <th width="125">Paid Amount</th>
                        <th width="120" align="center">Total</th>
                        <th width="120">Remark</th>
                    </tr>
                </thead>
                <tbody>
                    <TableLoading v-if="isLoading" :row="10" :column="10" />
                    <tr v-for="(room, index) in generatedLoad?.data" v-else :key="index"
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
                        <td align="center">
                            <span v-if="room.isPaid">
                                <img src="../../assets/icons/checkmark.png" class="w-6 h-6" alt="checked">
                            </span>
                            <span v-else> -- </span>
                        </td>
                        <td align="right">{{ room.paidAmountForDisplay }}</td>
                        <td align="right" class="font-semibold"
                            :class="!isTotalRow(index) ? `${getStatusClass(room)} !text-white` : '!text-blue-500'">
                            {{ room.totalAmountForDisplay }}
                        </td>
                        <td>{{ room.remark }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '~/components/FormHeader.vue';
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