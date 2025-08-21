<template>
    <div class="w-full max-w-4xl mx-auto">
        <FormHeader title="Generate Load" />
        <form action="#">
            <div class="input-form">
                <label for="date">Date</label>
                <input id="date" v-model="model.date" type="date" name="date" >
            </div>
            <div class="input-form">
                <label for="homeId">Home</label>
                <select id="homeId" v-model="selectedHome" name="homeId">
                    <option v-for="home in homes" :key="home" :value="home">{{ home }}</option>
                    <option v-for="home in homes" :key="home" :value="2">{{ 2 }}</option>
                </select>
            </div>
            <div class="input-form">
                <label for="extra">Extra</label>
                <input id="extra" v-model="model.extraAmount" type="number" name="extra">
            </div>
            <div class="input-form">
                <label for="load">Total usage (KW)</label>
                <input id="load" v-model="model.totalUsage" type="number" name="load">
            </div>
            <div class="input-form">
                <label for="usageAmount">Usage Amount</label>
                <input id="usageAmount" v-model="model.usageAmount" type="text" name="usageAmount">
            </div>
            <div v-if="model.usageAmount > 0 && model.totalUsage > 0" class="text-red-500 mx-2 mb-2 bg-gray-100 p-4 rounded-sm">
                {{ model.usageAmount / model.totalUsage }} ៛/kwh
            </div>
        </form>
        <div class="flex gap-2 mb-2">
            <TheButton1 name="Generate Load" type="tertiary" :loading="isLoading" @click="generateNewLoad"/>
            <TheButton1 v-if="isShowPreview" name="Save" type="primary" :loading="isLoading" @click="onSave"/>
        </div>
        <div v-if="isShowPreview" class="overflow-x-auto relative w-full bg-white rounded-lg shadow-md">
            <table class="w-full table-fixed">
                <thead>
                    <tr>
                        <th width="60" class="sticky left-0 z-20 bg-gray-200 shadow-sm">Room</th>
                        <th width="130">Previous (KW)</th>
                        <th width="100">New (KW)</th>
                        <th width="140">Usage Difference</th>
                        <th width="100">Has Usage</th>
                        <th width="120">Usage Amount</th>
                        <th width="120">Extra Amount</th>
                        <th width="120">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(room, index) in generateLoad?.data" :key="index">
                        <td align="center" class="sticky left-0 z-10 shadow-sm text-center bg-gray-100">{{ room.roomNumber }}</td>
                        <td align="center">{{ room.previousMonthKWForDisplay }}</td>
                        <td align="center">{{ room.currentMonthKWForDisplay }}</td>
                        <td align="center" class="!text-red-500 font-semibold">{{ room.usageDifferenceForDisplay }}</td>
                        <td align="center">
                            <span v-if="room.hasUsageThisMonth" class="text-blue-500">Yes</span>
                            <span v-else>No</span>
                        </td>
                        <td align="center">{{ room.usageAmountForDisplay }}</td>
                        <td align="center">{{ room.extraAmountByRoomForDisplay }}</td>
                        <td align="center">{{ room.totalAmountForDisplay }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts" setup>

const { model, generateNewLoad, isLoading, generateLoad, isShowPreview, homes, onSave, selectedHome } = useGenerateLoad();
</script>