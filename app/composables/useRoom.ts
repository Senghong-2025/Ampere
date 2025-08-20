import { rooms } from "~/assets/data/room";

const useRoom = () => {
    const selectedFloor = ref("0");
    const filteredRooms = computed(() => {
        if (selectedFloor.value === "0") {
            return rooms;
        }
        return rooms.filter(room => room.floor === Number(selectedFloor.value));
    });
    return {
        filteredRooms,
        selectedFloor,
    }
}
export default useRoom;