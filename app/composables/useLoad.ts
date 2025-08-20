import type { ICreateLoadRequest, ILoadResponse } from "~/models/load";
import { rooms } from "~/assets/data/room";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { formatInputDateTime, getMonthAndYearOnly, getMonthOnly } from "~/helpers/dateTimeHelper";
import notifyHelper from "~/helpers/notifyHelper";
const useLoad = () => {
    const { $db } = useNuxtApp();
    const homes = Array.from(new Set(rooms.map(room => room.homeId)));
    const floors = Array.from(new Set(rooms.map(room => room.floor)));
    const selectedHome = ref(homes[0]);
    const selectedFloor = ref(floors[0]);
    const filteredRooms = computed(() => rooms.filter(room => room.floor === selectedFloor.value));
    const filteredRoomsByHome = computed(() => {
        return rooms.filter(room => room.homeId === Number(selectedHome.value));
    });

    const isLoading = ref(false);
    const model = reactive<ICreateLoadRequest>({
        roomNumber: 0,
        currentKW: 0,
        createdOn: formatInputDateTime(new Date()),
        modifiedOn: formatInputDateTime(new Date()),
        homeId: 0
    });
    const handleSubmit = async () => {
        isLoading.value = true;
        const request: ICreateLoadRequest = {
            homeId: Number(selectedHome.value),
            roomNumber: model.roomNumber,
            currentKW: model.currentKW,
            createdOn: model.createdOn,
            modifiedOn: formatInputDateTime(new Date())
        };
        const q = query(
            collection($db, "load"),
            where("roomNumber", "==", model.roomNumber)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        const existingValue = computed(() => data.find(item => item.roomNumber === model.roomNumber && getMonthAndYearOnly(item.createdOn) === getMonthAndYearOnly(new Date(model.createdOn))));
        if (existingValue.value) {
            isLoading.value = false;
            notifyHelper.error("This already existing data");
            return;
        };
        try {
            await addDoc(collection($db, "load"), request);
            notifyHelper.success("Load created successfully.");
            model.roomNumber = 0;
            model.currentKW = 0;
            getLoadListByMonth();
        } catch (error) {
            console.error("Error creating load:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const loadList = ref<ILoadResponse[]>([]);
    const getLoadListByMonth = async () => {
        isLoading.value = true;
        try {
            const q = query(
                collection($db, "load"),
                where("homeId", "==", Number(selectedHome.value))
            );
            const snapshot = await getDocs(q);
            const dataByMonth = snapshot.docs.filter((d) => getMonthOnly(d.data().createdOn) === getMonthOnly(new Date(model.createdOn)));
            loadList.value = dataByMonth.map(doc => {
                const data = doc.data() as ILoadResponse;
                return {
                    ...data,
                    id: doc.id ?? ''
                };
            });
        } catch (error) {
            console.error("Error fetching load list:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const getLoadById = async (id: string) => {
        isLoading.value = true;
        try {
            const docRef = doc($db, "load", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as ILoadResponse;
                model.roomNumber = data.roomNumber;
                model.currentKW = data.currentKW;
                model.createdOn = data.createdOn;
                model.modifiedOn = data.modifiedOn;
                model.homeId = data.homeId;
            } else {
                console.error("No such document!");
            }
        } catch (error) {
            console.error("Error fetching load by ID:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const updateLoad = async (id: string) => {
        isLoading.value = true;
        try {
            const docRef = doc($db, "load", id);
            await updateDoc(docRef, model);
            notifyHelper.success("Load updated successfully.");
            navigateTo("/load/room-load");
        } catch (error) {
            console.error("Error updating load:", error);
        } finally {
            isLoading.value = false;
        }
    };
    return {
        model,
        handleSubmit,
        isLoading,
        floors,
        homes,
        selectedHome,
        selectedFloor,
        filteredRooms,
        getLoadListByMonth,
        loadList,
        filteredRoomsByHome,
        getLoadById,
        updateLoad,
    }
};

export default useLoad;