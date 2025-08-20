import type { IGenerateLoad, IGenerateLoadData } from '~/models/generateLoad';
import { formatInputDate, getMonthOnly } from './../helpers/dateTimeHelper';
import notifyHelper from '~/helpers/notifyHelper';
import { addDoc, collection } from 'firebase/firestore';

export interface IGenerateRequest {
    date: string;
    homeId: number;
    usageAmount: number;
    totalUsage: number;
    extraAmount: number;
}
const useGenerateLoad = () => {
    const { $db } = useNuxtApp();
    const { getLoadListByMonth, homes, selectedHome } = useLoad();
    const isLoading = ref(false);
    const model = reactive<IGenerateRequest>({
        date: formatInputDate(new Date()),
        homeId: selectedHome.value ?? 0,
        usageAmount: 0,
        totalUsage: 0,
        extraAmount: 0,
    });

    const today = new Date();
    const thisMonth = ref(getMonthOnly(today));
    const lastMonth = ref(getMonthOnly(new Date(today.getFullYear(), today.getMonth() - 1, 1)));
    const generateLoad = ref<IGenerateLoad>();
    const generateNewLoad = async () => {
        if (!model.homeId || model.usageAmount < 1 || model.totalUsage < 1) {
            notifyHelper.error("Please fill in all fields correctly.");
            return;
        }
        isLoading.value = true;
        try {
            const currentData = await getLoadListByMonth(thisMonth.value, false);
            const lastMonthData = await getLoadListByMonth(lastMonth.value, false);

            const loadData: IGenerateLoadData[] = (currentData ?? []).map((item) => {
                const lastMonthItem = lastMonthData?.find(
                    (lastItem) => lastItem.roomNumber === item.roomNumber
                );
                const calUsageKw = item.currentKW - (lastMonthItem?.currentKW ?? 0);
                const calUsageAmount = (model.usageAmount / model.totalUsage) * (calUsageKw ?? 0);
                return {
                    roomNumber: item.roomNumber,
                    currentMonthKW: item.currentKW,
                    previousMonthKW: lastMonthItem?.currentKW ?? 0,
                    hasUsageThisMonth: calUsageKw < item.currentKW,
                    usageDifference: calUsageKw,
                    usageAmount: calUsageAmount,
                    extraAmountByRoom: model.extraAmount,
                    totalAmount: model.extraAmount,
                    paidAmount: 0,
                    remark: "",
                    isPaid: false
                };
            }).sort((a, b) => a.roomNumber - b.roomNumber);

            generateLoad.value = {
                date: formatInputDate(new Date()),
                homeId: 1,
                totalUsage: 1000,
                data: loadData,
            };
            console.log('Generated Load:', generateLoad.value);
        } catch (error) {
            console.error("Errr:", error);
        } finally {
            isLoading.value = false;
        }
    };
    const isShowPreview = computed(() => !!generateLoad.value?.data.length);

    const onSave = async () => {
        try {
            console.log('Saving generated load:', generateLoad.value);
            await addDoc(collection($db, "generatedLoad"), generateLoad.value);
            notifyHelper.success("Generated load saved successfully.");
        } catch (error) {
            console.error("Error saving load:", error);
        }
    };

    return {
        model,
        generateNewLoad,
        isLoading,
        generateLoad,
        isShowPreview,
        homes,
        onSave,
        selectedHome,
    };
};

export default useGenerateLoad;