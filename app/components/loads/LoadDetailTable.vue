<template>
    <div 
        class="overflow-x-auto bg-white rounded-lg shadow-md mt-2 min-h-[200px]"
        style="max-height: calc(100vh - 230px)">
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
                    <th>ចំណាំ</th>
                    <th v-if="isShowAction">Action</th>
                </tr>
            </thead>
            <tbody>
                <TableLoading v-if="isLoading" :row="10" :column="isShowAction ? 11 : 10" />
                <tr 
                    v-for="(room, index) in generatedLoad.data"
                    v-else-if="!isLoading && generatedLoad?.data?.length"
                    :key="index"
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
                        align="right" 
                        class="font-semibold"
                        :class="!isTotalRow(index) ? `${getStatusClass(room)} !text-white` : '!text-blue-500'">
                        {{ room.totalAmountForDisplay }}
                    </td>
                    <td align="center">
                        <span v-if="isTotalRow(index)" class="text-blue-500">{{ room.isPaid ? 'Completed' : '--'
                            }}</span>
                        <span v-else :class="room.isPaidForDisplay.color">{{ room.isPaidForDisplay.text }}</span>
                    </td>
                    <td>{{ room.remark }}</td>
                    <td v-if="isShowAction" align="center">
                        <button 
                            v-if="!isTotalRow(index)" 
                            class="text-blue-500 hover:text-blue-700 cursor-pointer"
                            @click="emit('edit-load', room, generatedLoad.id ?? '')">
                            Edit
                        </button>
                        <span v-else> -- </span>
                    </td>
                </tr>
                <tr v-else>
                    <td :colspan="isShowAction ? 11 : 10" class="text-center">
                        No record!
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts" setup>
import type { GenerateLoad, GenerateLoadData } from '~/models/generateLoad';

const props = defineProps<{
    generatedLoad?: GenerateLoad,
    isLoading: boolean
    isShowAction: boolean
}>();

const emit = defineEmits<{
    (e: 'edit-load', room: GenerateLoadData, id: string): void
}>();

const getStatusClass = (room: GenerateLoadData) => {
    if (room.isPaid) return '!bg-green-600'
    if (!room.isPaid && (room.paidAmount ?? 0) > 0) return '!bg-yellow-500'
    return '!bg-red-300'
};

const route = useRoute();
const isTotalRow = (index: number): boolean => {
  return (
    route.path !== "/load/generate" &&
    props.generatedLoad?.data?.length === index + 1
  );
};
</script>