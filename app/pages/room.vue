<template>
    <div class="mx-auto max-w-3xl p-2 md:p-6">
        <FormHeader title="Room List" />
        <div class="flex p-4 bg-gray-200 rounded-md mb-2 items-center gap-4">
            <span class="font-semibold">Choose Floor:</span>
            <label class="flex items-center gap-1 cursor-pointer">
                <input id="all" v-model="selectedFloor" type="radio" name="floor" value="0">
                All
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
                <input id="floor1" v-model="selectedFloor" type="radio" name="floor" value="1">
                1
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
                <input id="floor2" v-model="selectedFloor" type="radio" name="floor" value="2">
                2
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
                <input id="floor3" v-model="selectedFloor" type="radio" name="floor" value="3">
                3
            </label>
        </div>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md">
            <table>
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Floor</th>
                        <th>Room Name</th>
                        <th>Members</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(room, index) in filteredRooms" :key="index">
                        <td>{{ room.roomNumber }}</td>
                        <td>{{ room.floor }}</td>
                        <td>{{ room.name }}</td>
                        <td>
                            <div class="flex flex-wrap gap-2">
                                <div v-for="(m, index) in room.members" :key="index">
                                    <div class="text-blue-500">
                                        <span>{{ m }}</span>
                                        <span v-if="index !== room.members.length - 1">,</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import FormHeader from '~/components/FormHeader.vue';

const { filteredRooms, selectedFloor } = useRoom();
</script>