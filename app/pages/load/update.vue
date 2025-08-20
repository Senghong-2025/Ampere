<template>
    <div class="mx-auto max-w-3xl">
        <FormHeader title="Update Load" />
        <form v-loading="isLoading" class="bg-gray-200 p-2 rounded-sm" @submit.prevent="updateLoad($route.query.id as string)">
            <div class="input-form">
                <label for="modifyKW">Modify (kW)</label>
                <input id="modifyKW" v-model="model.modifiedOn" type="date" name="modifyKW">
            </div>
            <div class="input-form">
                <label for="roomNumber">Room Number</label>
                <select id="roomNumber" v-model="model.roomNumber" name="roomNumber" disabled required>
                    <option v-for="value in rooms" :key="value.id" :value="value.roomNumber">{{ value.name }}
                    </option>
                </select>
            </div>
            <div class="input-form">
                <label for="currentKW">Current (KW)</label>
                <input id="currentKW" v-model="model.currentKW" type="number" name="currentKW" required>
            </div>
            <div class="flex justify-center">
                <TheButton1 name="Update" type="primary" :loading="isLoading" />
            </div>
        </form>
    </div>
</template>
<script lang="ts" setup>
import { rooms } from '~/assets/data/room';
import TheButton1 from '~/components/TheButton1.vue';

const {
    model,
    isLoading,
    getLoadById,
    updateLoad,
 } = useLoad();

 const route = useRoute();
 onMounted(() => {
    getLoadById(route.query.id as string);
});
</script>