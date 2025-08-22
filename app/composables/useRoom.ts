import { rooms } from "~/assets/data/room";

const useRoom = () => {
    const uniqueHome = Array.from(new Set(rooms.map(room => room.homeId)));
    const selectedFloor = ref("0");
    const selectedHome = ref(uniqueHome[0]);
    const filteredRooms = computed(() => {
        if (!selectedHome.value) {
            return rooms;
        }
        return rooms.filter(room => {
            const matchesHome = room.homeId === selectedHome.value;
            if (selectedFloor.value === "0") {
                return matchesHome;
            }
            return matchesHome && room.floor === Number(selectedFloor.value);
        });
    });
    return {
        filteredRooms,
        selectedFloor,
        selectedHome,
        uniqueHome,
    }
}
export default useRoom;