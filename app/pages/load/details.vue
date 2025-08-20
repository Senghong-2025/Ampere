<template>
    <div class="p-2 md:p-6 w-full">
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
                <input id="date" v-model="selectedDate" type="month" class="w-full">
            </div>
        </div>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md mt-2">
            <table>
                <thead>
                    <tr>    
                        <th width="80">Room</th>
                        <th width="100">Old KW</th>
                        <th width="100">Current KW</th>
                        <th width="120">Used</th>
                        <th>ថ្លៃសម្រាម</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- <tr v-for="(room, index) in filteredRooms" :key="index">
                        <td align="center">{{ room.roomNumber }}</td>
                        <td align="center">{{ room.floor }}</td>
                        <td>{{ room.name }}</td>
                        <td>
                            <div class="flex flex-wrap gap-2">
                                <div v-for="(m, index2) in room.members" :key="index2">
                                    <div class="text-blue-500">
                                        <span>{{ m }}</span>
                                        <span v-if="index2 !== room.members.length - 1">,</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr> -->
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import FormHeader from '~/components/FormHeader.vue';

const { selectedDate, selectedHome, homes} = useLoadDetails();
</script>