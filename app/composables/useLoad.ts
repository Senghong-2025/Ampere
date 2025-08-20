import type { ICreateLoadRequest } from "~/models/load";
import { rooms } from "~/assets/data/room";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getMonthAndYearOnly } from "~/helpers/dateTimeHelper";
const useLoad = () => {
    const { $db } = useNuxtApp();
    const homes = Array.from(new Set(rooms.map(room => room.homeId)));
    const floors = Array.from(new Set(rooms.map(room => room.floor)));
    const selectedHome = ref(homes[0]);
    const selectedFloor = ref(floors[0]);
    const filteredRooms = computed(() => rooms.filter(room => room.floor === selectedFloor.value));
    const model = reactive<ICreateLoadRequest>({
        roomNumber: 0,
        currentKW: 0,
        createdOn: String(new Date()),
        modifiedOn: String(new Date())
    });
    const handleSubmit = async () => {
        const request: ICreateLoadRequest = {
            roomNumber: model.roomNumber,
            currentKW: model.currentKW,
            createdOn: String(new Date()),
            modifiedOn: String(new Date())
        };
        const q = query(
            collection($db, "load"),
            where("roomNumber", "==", model.roomNumber)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        const existingValue = computed(() => data.find(item => item.roomNumber === model.roomNumber && getMonthAndYearOnly(item.createdOn) === getMonthAndYearOnly(new Date())));
        if(existingValue.value) {
            alert('data already exists')
            return;
        };
        try {
            const response = await addDoc(collection($db, "load"), request);
            console.log("Load created successfully:", response);
        } catch (error) {
            console.error("Error creating load:", error);
        }
    };
    return {
        model,
        handleSubmit,
        floors,
        homes,
        selectedHome,
        selectedFloor,
        filteredRooms
    }
};

export default useLoad;