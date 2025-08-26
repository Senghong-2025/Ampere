import { type IGenerateLoadData, GenerateLoad, GenerateLoadData, type IGenerateLoad } from '~/models/generateLoad';
import notifyHelper from '~/helpers/notifyHelper';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import type { ILoadResponse } from '~/models/load';
import useLoad from './useLoad';
import { formatInputDate, getStartAndEndOfMonth } from '~/helpers/dateTimeHelper';

const useGenerateLoad = () => {
    const { $db } = useNuxtApp();
    const { getLoadListByMonth, homes } = useLoad();
    const isLoading = ref(false);
    const model = reactive<Omit<IGenerateLoad, "id" | "data">>({
        date: formatInputDate(new Date()),
        homeId: homes[0] ?? 0,
        totalUsage: 0,
        savingAmount: 0,
        totalUsageAmount: 0,
        extraAmountEachRoom: 0,
    });

    const selectedDate = computed(() => model.date);
    const thisMonth = computed(() => {
        return new Date(selectedDate.value);
    });

    const lastMonth = computed(() => {
        const d = new Date(selectedDate.value);
        return new Date(d.getFullYear(), d.getMonth() - 1, 1);
    });

    const convertExtraAmount = (amount: number, load: ILoadResponse) => {
        if (load.homeId !== 3) return amount;
        switch (load.roomNumber) {
            case 1:
                return amount * 3;
            case 2:
                return 0;
            default:
                return amount;
        }
    };
    const generateLoad = ref<GenerateLoad>();
    const generateLoadDataForCreate = ref<IGenerateLoad>();
    const generateNewLoad = async () => {
        if (!model.homeId || model.totalUsageAmount < 1 || model.totalUsage < 1) {
            notifyHelper.error("Please fill in all required fields.");
            return;
        }
        isLoading.value = true;
        try {
            const [currentData, lastMonthData] = await Promise.all([
                getLoadListByMonth(thisMonth.value, false, model.homeId),
                getLoadListByMonth(lastMonth.value, false, model.homeId),
            ]);
            const createLoadData:IGenerateLoadData[] = [];
            const loadData: GenerateLoadData[]  = (currentData ?? []).map((item) => {
                const lastMonthItem = lastMonthData?.find(
                    (lastItem) => lastItem.roomNumber === item.roomNumber
                );
                const calUsageKw = item.currentKW - (lastMonthItem?.currentKW ?? 0);
                const calUsageAmount = ((model.totalUsageAmount + model.savingAmount) / model.totalUsage) * (calUsageKw ?? 0);

                const result = {
                    roomNumber: item.roomNumber,
                    currentMonthKW: item.currentKW,
                    previousMonthKW: lastMonthItem?.currentKW ?? 0,
                    hasUsageThisMonth: calUsageKw < item.currentKW,
                    usageDifference: calUsageKw,
                    usageAmount: calUsageAmount,
                    extraAmountByRoom: convertExtraAmount(model.extraAmountEachRoom, item),
                    totalAmount: model.extraAmountEachRoom + calUsageAmount,
                    paidAmount: 0,
                    remark: "",
                    isPaid: false
                };
                createLoadData.push(result);
                return new GenerateLoadData(result);
            }).sort((a, b) => a.roomNumber - b.roomNumber);

            generateLoad.value = {
                date: selectedDate.value,
                homeId: model.homeId,
                totalUsage: model.totalUsage,
                savingAmount: model.savingAmount,
                extraAmountEachRoom: model.extraAmountEachRoom,
                totalUsageAmount: model.totalUsageAmount,
                data: loadData,
            };
            generateLoadDataForCreate.value = {
                date: selectedDate.value,
                homeId: model.homeId,
                totalUsage: model.totalUsage,
                savingAmount: model.savingAmount,
                extraAmountEachRoom: model.extraAmountEachRoom,
                totalUsageAmount: model.totalUsageAmount,
                data: createLoadData.sort((a, b) => a.roomNumber - b.roomNumber),
            };
        } catch (error) {
            console.error("Error:", error);
        } finally {
            isLoading.value = false;
        }
    };
    const isShowPreview = computed(() => !!generateLoad.value?.data.length);

    const onSave = async () => {
        isLoading.value = true;
        try {
            const { startDate, endDate } = getStartAndEndOfMonth(new Date(selectedDate.value))
            const q = query(
                collection($db, "generatedLoad"),
                where("homeId", "==", model.homeId),
                where("date", ">=", startDate),
                where("date", "<=", endDate)
            );

            const snapshot = await getDocs(q);
            const existingData = snapshot.docs.map(doc => doc.data());
            if (existingData.length > 0) {
                notifyHelper.info("Load for this month and home already exists.");
                return;
            }
            await addDoc(collection($db, "generatedLoad"), generateLoadDataForCreate.value);
            notifyHelper.success("Generated load saved successfully.");
        } catch (error) {
            console.error("Error saving load:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const onReset = () => {
       model.homeId = homes[0] ?? 0;
       model.totalUsage = 0;
       model.totalUsageAmount = 0;
       generateLoad.value = new GenerateLoad({
            date: model.date,
            homeId: model.homeId,
            totalUsage: model.totalUsage,
            totalUsageAmount: model.totalUsageAmount,
            extraAmountEachRoom: model.extraAmountEachRoom,
            savingAmount: model.savingAmount,
            data: [],
       });
    };
    return {
        model,
        generateNewLoad,
        isLoading,
        generateLoad,
        isShowPreview,
        homes,
        onSave,
        onReset,
    };
};

export default useGenerateLoad;