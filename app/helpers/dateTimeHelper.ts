import { format } from "date-fns";

export const getMonthOnly = (date: Date) => {
    return format(date, 'MMMM');
};

export const getMonthAndYearOnly = (date: Date) => {
    return format(date, 'MMMM yyyy');
};

export const formatInputDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
};

export const formatInputDateTime = (date: Date) => {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
};

export const getStartAndEndOfMonth = (selectedDate: Date) => {
    const [year, month] = formatInputDate(selectedDate).split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;
    return {
        endDate,
        startDate,
    }
}