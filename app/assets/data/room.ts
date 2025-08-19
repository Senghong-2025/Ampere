import type { IRoom } from "~/models/room";

// The roomNumber is use for calculation please take risk before chaning it.
export const rooms: IRoom[] = [
  {
    roomId: 1,
    roomNumber: 15,
    name: "Living Room",
    homeId: 3,
    members: ["Senghong", "Chana", "Rasmey"],
  },
  {
    roomId: 2,
    roomNumber: 16,
    name: "Master Bedroom",
    homeId: 3,
    members: ["Sophol", "fdsf"],
  },
];
