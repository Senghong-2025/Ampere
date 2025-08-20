<template>
    <div class="mx-auto max-w-3xl p-2 md:p-6">
        <FormHeader title="Create Load" />
        <form class="bg-gray-200 p-2 rounded-sm" @submit.prevent="handleSubmit">
            <div class="input-form">
                <label for="currentKW">Current (kW)</label>
                <input id="currentKW" v-model="model.createdOn" type="date" name="currentKW" @change="getLoadListByMonth">
            </div>
            <div class="w-full flex gap-2">
                <div class="input-form w-full">
                    <label for="home">Home</label>
                    <select id="home" v-model="selectedHome" required>
                        <option v-for="home in homes" :key="home" :value="home">{{ home }}</option>
                    </select>
                </div>
                <div class="input-form w-full">
                    <label for="floor">Floor</label>
                    <select id="floor" v-model="selectedFloor" required>
                        <option v-for="floor in floors" :key="floor" :value="floor">{{ floor }}</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-wrap w-full gap-2 px-2">
                <div v-for="(val, index) in filteredRoomsByHome" :key="index" class="flex items-center gap-1">
                   <input type="checkbox" :value="val.roomNumber" disabled :checked="loadList.some(item => item.roomNumber === val.roomNumber)"> <span>{{ val.roomNumber }}</span>
                </div>
            </div>
            <div class="input-form">
                <label for="roomNumber">Room Number</label>
                <select id="roomNumber" v-model="model.roomNumber" name="roomNumber" required>
                    <option value="">select room</option>
                    <option v-for="value in filteredRooms" :key="value.id" :value="value.roomNumber">{{ value.name }}
                    </option>
                </select>
            </div>
            <div class="input-form">
                <label for="currentKW">Current (kW)</label>
                <input id="currentKW" v-model="model.currentKW" type="number" name="currentKW" required>
            </div>
            <div class="flex justify-center">
                <TheButton1 name="Save" type="primary" :loading="isLoading" />
            </div>
        </form>
    </div>
</template>
<script lang="ts" setup>
import TheButton1 from '~/components/TheButton1.vue';

const {
    model,
    handleSubmit,
    floors,
    homes,
    selectedHome,
    selectedFloor,
    filteredRooms,
    isLoading,
    getLoadListByMonth,
    loadList,
    filteredRoomsByHome
 } = useLoad();

 onMounted(() => {
    getLoadListByMonth();
});
</script>