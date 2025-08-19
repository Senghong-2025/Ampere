<script setup lang="ts">
import { loads } from "@/assets/data/load";

async function generatePDF() {
    const { jsPDF } = await import("jspdf");
    const { autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
    });

    loads.forEach((load, loadIndex) => {
        doc.setFontSize(18);
        doc.text(`Electrical Load Report - Home ID: ${load.homeId} - Date: ${load.date}`, 40, 40);

        const tableData = load.data.map(room => [
            room.roomName ?? '',
            room.connectedLoadKW ?? '',
            room.voltage ?? '',
            room.current ?? '',
            room.powerFactor ?? '',
            (room.devices && Array.isArray(room.devices))
                ? room.devices.map(item => item.hoursUsed ?? '').join(', ')
                : '',
        ]);

        autoTable(doc, {
            startY: 60,
            head: [['Room', 'Load (kW)', 'Voltage (V)', 'Current (A)', 'Power Factor', 'Devices']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 10 },
            // headStyles: { fillColor: [500, 240, 240] },
        });

        if (loadIndex < loads.length - 1) {
            doc.addPage();
        }
    });

    doc.save(`Electrical_Load_Report_${new Date().toISOString()}.pdf`);
}
</script>

<template>
    <div class="p-6">
        <div class="flex gap-2 w-full justify-end">
            <button class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="navigateTo('/load/create')">
                Create
            </button>
            <button class="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="generatePDF">
                Print PDF
            </button>
        </div>

        <!-- Optionally keep your HTML table for display only -->
        <div v-for="load in loads" :key="load.id" class="mb-4">
            <h2 class="text-xl font-semibold mb-2">Home ID: {{ load.homeId }} - Date: {{ load.date }}</h2>
            <table class="w-full table-auto border-collapse">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="border px-2 py-1">Room</th>
                        <th class="border px-2 py-1">Load (kW)</th>
                        <th class="border px-2 py-1">Voltage (V)</th>
                        <th class="border px-2 py-1">Current (A)</th>
                        <th class="border px-2 py-1">Power Factor</th>
                        <th class="border px-2 py-1">Devices</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="room in load.data" :key="room.roomNumber">
                        <td class="border px-2 py-1">{{ room.roomName }}</td>
                        <td class="border px-2 py-1">{{ room.connectedLoadKW }}</td>
                        <td class="border px-2 py-1">{{ room.voltage }}</td>
                        <td class="border px-2 py-1">{{ room.current }}</td>
                        <td class="border px-2 py-1">{{ room.powerFactor }}</td>
                        <td class="border px-2 py-1">
                            <ul class="list-disc pl-4">
                                <li v-for="device in room.devices" :key="device.name">
                                    {{ device.name }} x{{ device.quantity }} ({{ device.wattage }} W)
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
