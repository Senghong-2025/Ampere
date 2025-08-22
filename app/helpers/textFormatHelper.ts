export const formatPhoneNumber = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};
export const formatEmail = (email: string) => {
    return email.toLowerCase().trim();
};

export const accountingWithoutRoundUp = (value: number | string, decimal = 0) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numericValue)) return "0"; 
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
    }).format(Number(numericValue.toFixed(decimal)));
};