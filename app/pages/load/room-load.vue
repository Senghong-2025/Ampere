<template>
    <div class="mx-auto">
        <FormHeader title="Room Load" />
        <div class="flex gap-2 w-full">
            <div class="flex items-center gap-2 my-2 w-full">
                <label for="currentKW" class="w-32">Filter Home</label>
                <select id="home" v-model="selectedHome" name="home" class="w-full" @change="getLoadListByMonth()">
                    <option v-for="home in homes" :key="home" :value="home">{{ 'Home ' + home }}</option>
                </select>
            </div>
            <div class="flex items-center gap-2 my-2 w-full">
                <label for="currentKW" class="w-32">Filter Month</label>
                <input
                    id="currentKW"
                    v-model="model.createdOn"
                    type="date" name="currentKW" class="w-full"
                    @change="getLoadListByMonth()">
            </div>
        </div>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md relative">
            <table style="min-width: 350px !important;">
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Total KW for <span class="text-blue-600">{{ getMonthOnly(new Date(model.createdOn))
                                }}</span></th>
                        <th>Created On</th>
                        <th width="100">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <TableLoading v-if="isLoading" :row="5" :column="4" />
                    <template v-else>
                        <tr v-for="(room, index) in loadList.sort((a, b) => a.roomNumber - b.roomNumber)" :key="index">
                            <td class="font-semibold !text-blue-500">{{ room.roomNumber }}</td>
                            <td class="font-semibold !text-red-500">{{ room.currentKW }} (KW)</td>
                            <td>{{ room.createdOn }}</td>
                            <td align="center">
                                <button
                                    class="text-blue-500 hover:underline"
                                    @click="$router.push({ path: '/load/update', query: { id: room.id } })"
                                >Edit</button>
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
import useLoad from '~/composables/loads/useLoad';
import { getMonthOnly } from '~/helpers/dateTimeHelper';

const { getLoadListByMonth, loadList, isLoading, model, selectedHome, homes } = useLoad();

onMounted(() => {
    getLoadListByMonth();
});
</script>