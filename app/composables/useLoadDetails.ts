import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { rooms } from './../assets/data/room';
import { GenerateLoad, type GenerateLoadData, type IGenerateLoad } from '~/models/generateLoad';
import notifyHelper from '~/helpers/notifyHelper';

interface IUpdateModel {
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
    const getGeneratedLoadByMonth = async () => {
        isLoading.value = true;
        try {
            const [year, month] = selectedDate.value.split('-');
            const startDate = `${year}-${month}-01`;
            const endDate = `${year}-${month}-31`;
            const q = query(
                collection($db, "generatedLoad"),
                where("date", ">=", startDate),
                where("date", "<=", endDate)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.docs.map((doc) => {
                    generatedLoad.value = new GenerateLoad(doc.data() as IGenerateLoad);
                    if (generatedLoad.value) {
                        generatedLoad.value.id = doc.id;
                    }
                });
            } else {
                generatedLoad.value = new GenerateLoad({} as IGenerateLoad);
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

    const onUpdate = async () => {
        isLoading.value = true;
        try {
            generatedLoad.value?.data.map(v => {
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
            await updateDoc(docRef, { ...generatedLoad.value });
            notifyHelper.success("updated successfully.");
        } catch (error) {
            console.error("Error updating load:", error);
        } finally {
            dialogVisible.value = false;
            isLoading.value = false;
        }
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
    }
};

export default useLoadDetails;