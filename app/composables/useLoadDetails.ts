import { rooms } from './../assets/data/room';
const useLoadDetails = () => {
    const today = new Date()
    const selectedDate = ref(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
    )
    const homes = Array.from(new Set(rooms.map(room => room.homeId)));
    const selectedHome = ref(homes[0]);

    return {
        selectedDate,
        selectedHome,
        homes,
    }
};

export default useLoadDetails;