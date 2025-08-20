<template>
    <div class="mx-auto max-w-3xl p-6">
        <FormHeader title="Room List"/>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md">
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Room Number</th>
                        <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Room Name</th>
                        <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Members</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="room in rooms" :key="room.roomId" class="hover:bg-blue-50 transition-colors">
                        <td class="px-6 py-4 border-b border-gray-200 text-gray-700">{{ room.roomNumber }}</td>
                        <td class="px-6 py-4 border-b border-gray-200 text-gray-700">{{ room.name }}</td>
                        <td class="px-6 py-4 border-b border-gray-200 text-gray-700">
                            <div class="flex flex-wrap gap-2">
                                <div v-for="(m, index) in room.members" :key="index">
                                    <div class="text-blue-500">{{ m }}<span v-if="index !== room.members.length - 1">,</span></div>
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
import { rooms } from '~/assets/data/room';
import FormHeader from '~/components/FormHeader.vue';
</script>