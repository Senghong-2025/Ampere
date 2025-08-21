<template>
    <div class="w-full">
        <FormHeader title="Load Details" />
        <div class="filter-form flex gap-2">
            <div class="flex items-center gap-2 w-full">
                <label for="home">Home</label>
                <select id="home" v-model="selectedHome" class="w-full">
                    <option v-for="home in homes" :key="home" :value="home">{{ home }}</option>
                </select>
            </div>
            <div class="flex items-center gap-2 w-full">
                <label for="date">Date</label>
                <input id="date" v-model="selectedDate" type="month" class="w-full" @change="getGeneratedLoadByMonth">
            </div>
        </div>
        <div v-loading="isLoading" class="overflow-x-auto bg-white rounded-lg shadow-md mt-2 min-h-[200px]">
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
                        <th width="120">Remark</th>
                        <th width="120" align="center">Total</th>
                        <th width="80" align="center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(room, index) in generatedLoad?.data" :key="index">
                        <td align="center" class="!text-blue-500 font-semibold sticky left-0  bg-gray-100">{{
                            room.roomNumber }}</td>
                        <td align="left">{{ room.previousMonthKWForDisplay }}</td>
                        <td align="left">{{ room.currentMonthKWForDisplay }}</td>
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
                        <td>{{ room.remark }}</td>
                        <td
                            align="right" class="!text-white font-semibold"
                            :class="getStatusClass(room)"
                        >
                            {{ room.totalAmountForDisplay }}
                        </td>
                        <td align="center">
                            <button
                                class="text-blue-500 hover:text-blue-700 cursor-pointer"
                                @click="editLoad(room, generatedLoad?.id ?? '')"
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-dialog v-model="dialogVisible" title="Update Load Details" :width="deviceHelper.isMobile ? '90%' : '600px'">
            <div class="text-gray-500 bg-blue-200 p-2 rounded-md mb-2">
                Update the load details for the selected home and date room number: <span class="text-blue-600 font-bold">{{ updateModel.roomNumber }}</span>
            </div>
            <div class="w-full space-y-2">
                <div class="flex w-full items-center">
                    <label for="isPaid" class="w-[150px]">Is Paid</label>
                    <input id="isPaid" v-model="updateModel.isPaid" type="checkbox" class="flex-1" @change="onSwitchChange">
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
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" :loading="isLoading" @click="onUpdate">
                        Update
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '~/components/FormHeader.vue';
import deviceHelper from '~/helpers/deviceHelper';
import type { GenerateLoadData } from '~/models/generateLoad';

const { selectedDate, selectedHome, homes, getGeneratedLoadByMonth, generatedLoad, isLoading, editLoad, onUpdate,
    dialogVisible,
    updateModel,
    onSwitchChange,
} = useLoadDetails();
onMounted(() => {
    getGeneratedLoadByMonth();
});
const getStatusClass = (room: GenerateLoadData) => {
  if (room.isPaid) return '!bg-green-600'
  if (!room.isPaid && (room.paidAmount ?? 0) > 0) return '!bg-yellow-500'
  return '!bg-red-300'
}
</script>