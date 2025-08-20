<template>
    <div class="p-2 md:p-6">
        <div class="flex w-full overflow-x-auto p-2">
            <div class="flex gap-2 w-full">
                <NuxtLink
                    v-for="(route, index) in loadRoutes" :key="index" :to="route.path"
                    class="rounded-sm px-2 py-2"
                    :class="[ $route.path === route.path ? 'bg-red-800 text-white': 'bg-gray-100' ]">
                    <span>{{ route.name }}</span>
                </NuxtLink>
            </div>
        </div>
        <NuxtPage/>
    </div>
</template>
<script setup lang="ts">
// import { loads } from "@s/assets/data/load";

const { loadRoutes } = useNavbar();
// async function generatePDF() {
//     const { jsPDF } = await import("jspdf");
//     const { autoTable } = await import("jspdf-autotable");
//     const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "pt",
//         format: "a4",
//     });

//     loads.forEach((load, loadIndex) => {
//         doc.setFontSize(18);
//         doc.text(`Electrical Load Report - Home ID: ${load.homeId} - Date: ${load.date}`, 40, 40);

//         const tableData = load.data.map(room => [
//             room.roomName ?? '',
//             room.connectedLoadKW ?? '',
//             room.voltage ?? '',
//             room.current ?? '',
//             room.powerFactor ?? '',
//             (room.devices && Array.isArray(room.devices))
//                 ? room.devices.map(item => item.hoursUsed ?? '').join(', ')
//                 : '',
//         ]);

//         autoTable(doc, {
//             startY: 60,
//             head: [['Room', 'Load (kW)', 'Voltage (V)', 'Current (A)', 'Power Factor', 'Devices']],
//             body: tableData,
//             theme: 'grid',
//             styles: { fontSize: 10 },
//             // headStyles: { fillColor: [500, 240, 240] },
//         });

//         if (loadIndex < loads.length - 1) {
//             doc.addPage();
//         }
//     });

//     doc.save(`Electrical_Load_Report_${new Date().toISOString()}.pdf`);
// }
</script>