import type { ICreateLoadRequest, ILoadResponse } from "~/models/load";
import { rooms } from "~/assets/data/room";
import { formatInputDate, getMonthAndYearOnly, getStartAndEndOfMonth } from "~/helpers/dateTimeHelper";
import notifyHelper from "~/helpers/notifyHelper";
const useLoad = () => {
    const homes = Array.from(new Set(rooms.map(room => room.homeId)));
    const floors = Array.from(new Set(rooms.map(room => room.floor)));
    const selectedHome = ref(homes[0]);
    const selectedFloor = ref(floors[0]);
    const filteredRooms = computed(() => rooms.filter(room => room.floor === selectedFloor.value && room.homeId === Number(selectedHome.value)));
    const filteredRoomsByHome = computed(() => {
        return rooms.filter(room => room.homeId === Number(selectedHome.value));
    });

    const isLoading = ref(false);
    const model = reactive<ICreateLoadRequest>({
        roomNumber: 0,
        currentKW: 0,
        createdOn: formatInputDate(new Date()),
        modifiedOn: formatInputDate(new Date()),
        homeId: 0
    });
    const handleSubmit = async () => {
        isLoading.value = true;
        const request: ICreateLoadRequest = {
            homeId: Number(selectedHome.value),
            roomNumber: model.roomNumber,
            currentKW: model.currentKW,
            createdOn: model.createdOn,
            modifiedOn: formatInputDate(new Date())
        };
        const { startDate, endDate } = getStartAndEndOfMonth(new Date(model.createdOn));
        const data = await $fetch<ILoadResponse[]>('/api/loads', {
            query: {
                homeId: Number(selectedHome.value),
                roomNumber: model.roomNumber,
                startDate,
                endDate,
                limit: 1,
            },
        });
        const existingValue = computed(() => data.find(item => item.roomNumber === model.roomNumber && getMonthAndYearOnly(new Date(item.createdOn)) === getMonthAndYearOnly(new Date(model.createdOn))));
        if (existingValue.value) {
            isLoading.value = false;
            notifyHelper.error("This already existing data");
            return;
        };
        try {
            await $fetch('/api/loads', {
                method: 'POST',
                body: request,
            });
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
    const getLoadListByMonth = async (date?: Date, isDefault: boolean = true,  homeId?: number) => {
        isLoading.value = true;
        const selectedDate = computed(() => model.createdOn);
        const { startDate, endDate } = getStartAndEndOfMonth(isDefault ? new Date(selectedDate.value) : date ?? new Date());
        try {
            loadList.value = await $fetch<ILoadResponse[]>('/api/loads', {
                query: {
                    homeId: isDefault ? Number(selectedHome.value) : homeId,
                    startDate,
                    endDate,
                    limit: 50,
                },
            });
            return loadList.value;
        } catch (error) {
            console.error("Error fetching load list:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const getLoadById = async (id: string) => {
        isLoading.value = true;
        try {
            const data = await $fetch<ILoadResponse>(`/api/loads/${id}`);
            model.roomNumber = data.roomNumber;
            model.currentKW = data.currentKW;
            model.createdOn = data.createdOn;
            model.modifiedOn = data.modifiedOn;
            model.homeId = data.homeId;
        } catch (error) {
            console.error("Error fetching load by ID:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const updateLoad = async (id: string) => {
        isLoading.value = true;
        try {
            await $fetch(`/api/loads/${id}`, {
                method: 'PATCH',
                body: {
                    ...model,
                    modifiedOn: formatInputDate(new Date()),
                },
            });
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
