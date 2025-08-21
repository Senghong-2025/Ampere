import type { IGenerateLoad, IGenerateLoadData } from '~/models/generateLoad';
import { formatInputDate, getMonthOnly } from './../helpers/dateTimeHelper';
import notifyHelper from '~/helpers/notifyHelper';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

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

    const selectedDate = computed(() => model.date);
    const thisMonth = computed(() => {
        const d = new Date(selectedDate.value);
        return getMonthOnly(d);
    });

    const lastMonth = computed(() => {
        const d = new Date(selectedDate.value);
        return getMonthOnly(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    });
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
                    totalAmount: model.extraAmount + calUsageAmount,
                    paidAmount: 0,
                    remark: "",
                    isPaid: false
                };
            }).sort((a, b) => a.roomNumber - b.roomNumber);

            generateLoad.value = {
                date: selectedDate.value,
                homeId: Number(model.homeId),
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
        isLoading.value = true;
        try {
            const [year, month] = formatInputDate(new Date(selectedDate.value)).split('-');

            const lastDay = new Date(Number(year), Number(month), 0).getDate();
            const startDate = `${year}-${month}-01`;
            const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
            console.log(startDate, endDate);
            const q = query(
                collection($db, "generatedLoad"),
                where("homeId", "==", Number(model.homeId))
            );

            const snapshot = await getDocs(q);

            const existingData = snapshot.docs.filter(doc => {
                const data = doc.data();
                return data.date >= startDate && data.date <= endDate;
            });

            if (existingData.length > 0) {
                notifyHelper.info("Data already exists for the selected month.");
                return;
            }
            await addDoc(collection($db, "generatedLoad"), generateLoad.value);
            notifyHelper.success("Generated load saved successfully.");
        } catch (error) {
            console.error("Error saving load:", error);
        } finally {
            isLoading.value = false;
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