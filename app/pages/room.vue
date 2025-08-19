<template>
    <div class="max-w-4xl mx-auto p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">RRRR</h2>
        <div class="overflow-x-auto bg-white rounded-lg shadow-md">
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Room Name</th>
                        <!-- <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Room ID</th> -->
                        <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Room Number</th>
                        <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Members</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="room in rooms" :key="room.roomId" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 border-b border-gray-200 text-gray-700">{{ room.roomNumber }}</td>
                        <td class="px-6 py-4 border-b border-gray-200 text-gray-700">{{ room.name }}</td>
                        <td class="px-6 py-4 border-b border-gray-200 text-gray-700">
                            <div class="flex flex-wrap gap-2">
                                <div v-for="(m, index) in room.members" :key="index">
                                    <div class="text-blue-500 " :class="[{'after:content-[\',\']': index !== room.members.length - 1 }]">{{ m }}</div>
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
</script>