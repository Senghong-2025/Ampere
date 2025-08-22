import { collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { rooms } from './../assets/data/room';
import { GenerateLoad, GenerateLoadData, type IGenerateLoad, type IGenerateLoadData } from '~/models/generateLoad';
import notifyHelper from '~/helpers/notifyHelper';
import { createColumn, exportHelper } from '~/helpers/explortHelper';
import { getStartAndEndOfMonth } from '~/helpers/dateTimeHelper';

interface IUpdateModel {
    roomNumber: string;
    isPaid: boolean;
    paidAmount: number;
    remark: string;
}
const useLoadDetails = () => {
    const { $db } = useNuxtApp();
    const today = new Date()
    const selectedDate = ref(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
    )
    const homes = Array.from(new Set(rooms.map(room => room.homeId)));
    const selectedHome = ref(homes[0]);

    const isLoading = ref(false);
    const generatedLoad = ref<GenerateLoad>();
    const generateLoadForUpdate = ref<IGenerateLoad>();
    const totalLoadByMonth = ref<GenerateLoadData>();
    const getGeneratedLoadByMonth = async () => {
        console.log(selectedDate.value, selectedHome.value);
        isLoading.value = true;
        try {
            const { startDate, endDate } = getStartAndEndOfMonth(new Date(selectedDate.value))
            const q = query(
                collection($db, "generatedLoad"),
                where("homeId", "==", selectedHome.value ?? 0),
                where("date", ">=", startDate),
                where("date", "<=", endDate),
                limit(1)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.docs.map((doc) => {
                    generatedLoad.value = new GenerateLoad(doc.data() as IGenerateLoad);
                    if (generatedLoad.value) {
                        generatedLoad.value.id = doc.id;
                    }
                    const preTotal: IGenerateLoadData = {
                        roomNumber: 0,
                        currentMonthKW: 0,
                        previousMonthKW: 0,
                        hasUsageThisMonth: false,
                        usageDifference: 0,
                        usageAmount: 0,
                        extraAmountByRoom: 0,
                        totalAmount: 0
                    };
                    generatedLoad.value.data.forEach((val) => {
                        preTotal.roomNumber = 'Total' as unknown as number;
                        preTotal.currentMonthKW += val.currentMonthKW;
                        preTotal.previousMonthKW += val.previousMonthKW;
                        preTotal.usageDifference += val.usageDifference;
                        preTotal.usageAmount += val.usageAmount;
                        preTotal.extraAmountByRoom += val.extraAmountByRoom;
                        preTotal.totalAmount += val.totalAmount;
                    });
                    totalLoadByMonth.value = new GenerateLoadData(preTotal);
                    generatedLoad.value.data = [
                        ...generatedLoad.value.data,
                        totalLoadByMonth.value,
                    ]
                    generateLoadForUpdate.value = doc.data() as IGenerateLoad;
                    generateLoadForUpdate.value.id = doc.id;
                });
            } else {
                generatedLoad.value = new GenerateLoad({
                    date: selectedDate.value,
                    homeId: selectedHome.value ?? 0,
                    totalUsage: 0,
                    data: []
                });
                notifyHelper.info('No generated load found for the specified month and year.');
            }
        } catch (error) {
            console.error("Error fetching generated load by month and year:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const dialogVisible = ref(false);
    const updateModel = reactive<IUpdateModel>({
        roomNumber: "",
        isPaid: false,
        paidAmount: 0,
        remark: ""
    });
    const updatedId = ref<string>("");
    const clonedUpdateData = ref<GenerateLoadData>();
    const editLoad = (room: GenerateLoadData, id: string) => {
        dialogVisible.value = true;
        updatedId.value = id;
        clonedUpdateData.value = room;
        Object.assign(updateModel, room);
    };

    const onSwitchChange = () => {
        const total = clonedUpdateData.value?.totalAmount ?? 0;
        updateModel.paidAmount = updateModel.isPaid ? total : 0;
    };

    const isUpdating = ref(false);
    const onUpdate = async () => {
        isUpdating.value = true;
        try {
            generateLoadForUpdate.value?.data.map(v => {
                if (v.roomNumber === clonedUpdateData.value?.roomNumber) {
                    v.currentMonthKW = clonedUpdateData.value.currentMonthKW;
                    v.previousMonthKW = clonedUpdateData.value.previousMonthKW;
                    v.usageDifference = clonedUpdateData.value.usageDifference;
                    v.usageAmount = clonedUpdateData.value.usageAmount;
                    v.extraAmountByRoom = clonedUpdateData.value.extraAmountByRoom;
                    v.totalAmount = clonedUpdateData.value.totalAmount;
                    v.isPaid = updateModel.isPaid;
                    v.paidAmount = updateModel.paidAmount;
                    v.remark = updateModel.remark;
                }
            });
            const docRef = doc($db, "generatedLoad", updatedId.value);
            await updateDoc(docRef, { ...generateLoadForUpdate.value });
            await getGeneratedLoadByMonth();
            notifyHelper.success("updated successfully.");
        } catch (error) {
            console.error("Error updating load:", error);
        } finally {
            dialogVisible.value = false;
            isUpdating.value = false;
        }
    };

    const columns = [
        createColumn({
            key: 'roomNumber',
            title: 'Room Id',
            displayFormat: 'center',
        }),
        createColumn({
            key: 'previousMonthKWForDisplay',
            title: 'Previous KW',
            displayFormat: 'center',
        }),
        createColumn({
            key: 'currentMonthKWForDisplay',
            title: 'Current KW',
            displayFormat: 'center',
        }),
        createColumn({
            key: 'usageDifferenceForDisplay',
            title: 'Usage (kWh)',
            displayFormat: 'center',
        }),
        createColumn({
            key: 'usageAmountForDisplay',
            title: 'Usage Amount',
            displayFormat: 'right',
        }),
        createColumn({
            key: 'extraAmountByRoomForDisplay',
            title: 'Extra Amount',
            displayFormat: 'right',
        }),
        createColumn({
            key: 'totalAmountForDisplay',
            title: 'Total',
            displayFormat: 'right',
        }),
        // createColumn({
        //     key: 'isPaid',
        //     title: 'Paid',
        //     displayFormat: 'center',
        // }),
        // createColumn({
        //     key: 'paidAmountForDisplay',
        //     title: 'Paid Amount',
        //     displayFormat: 'right',
        // }),
        // createColumn({
        //     key: 'remark',
        //     title: 'Remark',
        //     displayFormat: 'left',
        // }),
    ];

    const headerTitles = [
        ['ថ្លៃភ្លើង'],
        [`Exported Date: ` + new Date().toLocaleDateString()]
    ];
    const formatHorizontal = (colIndex: number) => {
        if ([1, 2, 3].includes(colIndex)) return 'left';
        if ([4, 5, 6].includes(colIndex)) return 'right';
        return 'center';
    };
    async function handleExport() {
        exportHelper(generatedLoad.value?.data ?? [], columns, 'generated_load.xlsx', 'Generated Load', headerTitles, true, formatHorizontal);
    }

    const router = useRouter();
    const route = useRoute();
    const handleShare = () => {
        const encodedDate = btoa(selectedDate.value);
        const encodedHome = btoa(String(selectedHome.value ?? "0"));
        window.open(`${window.origin}/share/load?d=${encodedDate}&h=${encodedHome}`, "_blank");
    };

    const handleChange = () => {
        const encodedDate = btoa(selectedDate.value);
        const encodedHome = btoa(String(selectedHome.value ?? "0"));
        router.replace({
            query: {
                d: encodedDate,
                h: encodedHome,
            },
        });
    };
    watch(
        () => route.query,
        (newQuery) => {
            if (newQuery.d) {
                selectedDate.value = atob(newQuery.d as string);
            }
            if (newQuery.h) {
                selectedHome.value = Number(atob(newQuery.h as string));
            }
            getGeneratedLoadByMonth();
        },
        { immediate: true }
    );
    return {
        selectedDate,
        selectedHome,
        homes,
        isLoading,
        getGeneratedLoadByMonth,
        generatedLoad,
        editLoad,
        onUpdate,
        updateModel,
        dialogVisible,
        onSwitchChange,
        handleExport,
        isUpdating,
        handleShare,
        handleChange,
    }
};

export default useLoadDetails;