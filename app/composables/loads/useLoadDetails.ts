import { rooms } from '@/assets/data/room';
import { GenerateLoad, GenerateLoadData, type IGenerateLoad, type IGenerateLoadData } from '~/models/generateLoad';
import notifyHelper from '~/helpers/notifyHelper';
import { createColumn } from '~/helpers/explortHelper';
import { getMonthAndYearOnly, getStartAndEndOfMonth } from '~/helpers/dateTimeHelper';
import { accountingWithoutRoundUp } from '~/helpers/textFormatHelper';

interface IUpdateModel {
    roomNumber: string;
    isPaid: boolean;
    paidAmount: number;
    remark: string;
    bankTransfer: number
}
const useLoadDetails = () => {
    // const { sendMessageToGroup } = useTelegramBot();
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
        isLoading.value = true;
        try {
            const { startDate, endDate } = getStartAndEndOfMonth(new Date(selectedDate.value))
            const generatedLoads = await $fetch<IGenerateLoad[]>('/api/generated-loads', {
                query: {
                    homeId: selectedHome.value ?? 0,
                    startDate,
                    endDate,
                    limit: 1,
                },
            });
            if (generatedLoads.length) {
                generatedLoads.map((load) => {
                    generatedLoad.value = new GenerateLoad(load);
                    if (generatedLoad.value) {
                        generatedLoad.value.id = load.id;
                    }
                    const preTotal: IGenerateLoadData = {
                        roomNumber: 0,
                        currentMonthKW: 0,
                        previousMonthKW: 0,
                        hasUsageThisMonth: false,
                        usageDifference: 0,
                        usageAmount: 0,
                        extraAmountByRoom: 0,
                        totalAmount: 0,
                    };
                    let remainingAmount = 0;
                    generatedLoad.value.data.forEach((val) => {
                        preTotal.roomNumber = 'Total' as unknown as number;
                        preTotal.currentMonthKW += val.currentMonthKW;
                        preTotal.previousMonthKW += val.previousMonthKW;
                        preTotal.usageDifference += val.usageDifference;
                        preTotal.usageAmount += val.usageAmount;
                        preTotal.extraAmountByRoom += val.extraAmountByRoom;
                        preTotal.totalAmount += val.totalAmount;
                        preTotal.isPaid = generatedLoad.value?.data.every(item => item.isPaid);
                        remainingAmount += val.isPaid ? 0 : val.totalAmount;
                    });
                    preTotal.remark = `នៅខ្វះ: ${accountingWithoutRoundUp(remainingAmount)} ៛`;
                    totalLoadByMonth.value = new GenerateLoadData(preTotal);
                    generatedLoad.value.data = [
                        ...generatedLoad.value.data,
                        totalLoadByMonth.value,
                    ]
                    generateLoadForUpdate.value = load;
                    generateLoadForUpdate.value.id = load.id;
                    generateLoadForUpdate.value.bankTransfer = 0;
                });
            } else {
                generatedLoad.value = new GenerateLoad({
                    date: selectedDate.value,
                    homeId: selectedHome.value ?? 0,
                    totalUsage: 0,
                    savingAmount: 0,
                    totalUsageAmount: 0,
                    extraAmountEachRoom: 0,
                    bankTransfer: 0,
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
        remark: "",
        bankTransfer: 0,
    });
    const updatedId = ref<string>("");
    const clonedUpdateData = ref<GenerateLoadData>();
    const editLoad = (load: GenerateLoadData, id: string) => {
        dialogVisible.value = true;
        updatedId.value = id;
        clonedUpdateData.value = load;
        const cloned = {...load};
        // if(cloned.paidAmount) cloned.paidAmount = Number(accountingWithoutRoundUp(String(cloned.paidAmount), 2));
        Object.assign(updateModel, cloned);
    };

    const totalAmountForPaid = computed(()=> clonedUpdateData.value?.totalAmount ?? 0);
    const onSwitchChange = () => {
        updateModel.paidAmount = updateModel.isPaid ? totalAmountForPaid.value : 0;
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
            await $fetch(`/api/generated-loads/${updatedId.value}`, {
                method: 'PATCH',
                body: { ...generateLoadForUpdate.value },
            });
            await Promise.all([
                // sendMessageToGroup(`📢 <strong>ថ្លៃភ្លើងកុដិលេខ ${selectedHome.value} នៅបន្ទប់លេខ ${clonedUpdateData.value?.roomNumber}</strong>\n\n- ប្រើប្រាស់អស់: ${clonedUpdateData.value?.usageDifferenceForDisplay}\n- សរុបថ្លៃប្រើប្រាស់: ${clonedUpdateData.value?.totalAmountForDisplay}\n- បង់លុយចំនួន: ${accountingWithoutRoundUp(updateModel.paidAmount)} ៛\n- រួចរាល់?: ${updateModel.isPaid ? "បង់រួចរាល់ ✅" : "មិនទាន់គ្រប់ ⚠️"}\n- កំណត់សម្គាល់: ${updateModel.remark || "គ្មាន"}`),
                getGeneratedLoadByMonth()
            ]);
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
        if (import.meta.server) return;
        const { exportHelper } = await import('~/helpers/explortHelper');
        await exportHelper(generatedLoad.value?.data ?? [], columns, `Generated_load_${selectedHome.value}_${getMonthAndYearOnly(new Date(selectedDate.value))}.xlsx`, 'Generated Load', headerTitles, true, formatHorizontal);
    }

    const router = useRouter();
    const route = useRoute();
    const shareVisible = ref(false);
    const shareUrl = ref('');
    const handleShare = () => {
        const encodedDate = btoa(selectedDate.value);
        const encodedHome = btoa(String(selectedHome.value ?? "0"));
        shareVisible.value = true;
        shareUrl.value = `${window.origin}/share/load?d=${encodedDate}&h=${encodedHome}`;
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

    const handleOpenLink = () => {
        window.open(shareUrl.value, "_blank");
        shareVisible.value = false;
    };

    const isShowConfirm = ref(false);
    const deleteLoadId = ref('');
    const onClickDelete = (load: GenerateLoad) => {
        isShowConfirm.value = true;
        deleteLoadId.value = load.id ?? "";
    };

    const onConfirmDelete = async () => {
        isLoading.value = true;
        try {
            await $fetch(`/api/generated-loads/${deleteLoadId.value}`, {
                method: 'DELETE',
            });
            notifyHelper.success("Deleted successfully.");
            isShowConfirm.value = false;
            await getGeneratedLoadByMonth();
        } catch (error) {
            console.error("Error deleting load:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const onPaidAmountInput = () => {
        updateModel.isPaid = updateModel.paidAmount >= (clonedUpdateData.value?.totalAmount ?? 0);
    };

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
        shareVisible,
        shareUrl,
        handleOpenLink,
        onClickDelete,
        onConfirmDelete,
        isShowConfirm,
        totalAmountForPaid,
        onPaidAmountInput,
    }
};

export default useLoadDetails;
