import { format } from "date-fns";

export const getMonthOnly = (date: Date) => {
    return format(date, 'MMMM');
};

export const getMonthAndYearOnly = (date: Date) => {
    return format(date, 'MMMM yyyy');
};
