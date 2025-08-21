<template>
    <div class="mx-auto max-w-3xl">
        <FormHeader title="Room Load" />
        <div class="flex items-center gap-2 my-2">
            <label for="currentKW" class="w-32">Filter Month</label>
            <input id="currentKW" v-model="model.createdOn" type="date" name="currentKW" class="w-full" @change="onMonthChange">
        </div>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md relative">
            <table style="min-width: 350px !important;">
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Total KW for <span class="text-blue-600">{{ getMonthOnly(new Date(model.createdOn)) }}</span></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="isLoading">
                        <tr v-for="(room, index) in 5" :key="index">
                            <td class="px-4">
                                <div class="w-16 animate-pulse rounded bg-gray-200 h-[20px]" />
                            </td>
                            <td class="px-4">
                                <div class="w-24 animate-pulse rounded bg-gray-200 h-[20px]" />
                            </td>
                            <td class="px-4">
                                <div class="w-24 animate-pulse rounded bg-gray-200 h-[20px]" />
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="(room, index) in loadList.sort((a, b) => a.roomNumber - b.roomNumber)" :key="index">
                            <td class="font-semibold !text-blue-500">{{ room.roomNumber }}</td>
                            <td class="font-semibold !text-red-500">{{ room.currentKW }} (KW)</td>
                            <td>
                                <button class="text-blue-500 hover:underline" @click="$router.push({ path: '/load/update', query: { id: room.id } })">Edit</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '~/components/FormHeader.vue';
import { getMonthOnly } from '~/helpers/dateTimeHelper';

const { getLoadListByMonth, loadList, isLoading, model } = useLoad();

function onMonthChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    getLoadListByMonth(value);
}

onMounted(() => {
    getLoadListByMonth();
});
</script>