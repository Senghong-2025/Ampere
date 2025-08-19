import type { ILoad } from "~/models/load";

export const loads: ILoad[] = [
  {
    id: 1,
    homeId: 101,
    date: "2025-08-19",
    data: [
      {
        roomNumber: 1,
        roomName: "Living Room",
        connectedLoadKW: 2.5,
        voltage: 220,
        current: 11.36,
        powerFactor: 0.9,
        devices: [
          { name: "LED Light", quantity: 6, wattage: 10 },
          { name: "Fan", quantity: 2, wattage: 75 }
        ]
      },
      {
        roomNumber: 2,
        roomName: "Master Bedroom",
        connectedLoadKW: 1.8,
        voltage: 220,
        current: 8.18,
        powerFactor: 0.95,
        devices: [
          { name: "LED Light", quantity: 4, wattage: 10 },
          { name: "AC", quantity: 1, wattage: 1500 }
        ]
      }
    ]
  }
];
