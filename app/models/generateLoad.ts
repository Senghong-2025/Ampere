export interface IGenerateLoad {
    id?: string;
    date: string;                    // Report date (ISO string)
    homeId: number;                   // Home identifier
    totalUsage: number;               // Total kW used this month (sum of differences)
    data: GenerateLoadData[];        // Per-room breakdown
}

export class GenerateLoad implements IGenerateLoad {
    id?: string | undefined;
    date: string;
    homeId: number;
    totalUsage: number;
    data: GenerateLoadData[];

    constructor(data: IGenerateLoad) {
        this.id = data.id;
        this.date = data.date;
        this.homeId = data.homeId;
        this.totalUsage = data.totalUsage;
        this.data = data.data.map(item => new GenerateLoadData(item));
    }
}
export interface IGenerateLoadData {
    roomNumber: number;          // Room identifier
    currentMonthKW: number;           // Current month's reading
    previousMonthKW: number;          // Previous month's reading
    hasUsageThisMonth: boolean;       // True if usage > 0
    usageDifference: number;          // Current - Previous (kWh used this month)
    usageAmount: number;              // usageDifference * unitPrice
    extraAmountByRoom: number;       // Additional fixed/variable charge
    totalAmount: number;              // usageAmount + extraAmount
    isPaid?: boolean;                  // Payment status
    paidAmount?: number;               // Amount paid
    remark?: string;                   // Remark
}

export class GenerateLoadData implements IGenerateLoadData {
    roomNumber: number;
    currentMonthKW: number;
    previousMonthKW: number;
    hasUsageThisMonth: boolean;
    usageDifference: number;
    usageAmount: number;
    extraAmountByRoom: number;
    totalAmount: number;
    isPaid?: boolean;
    paidAmount?: number;
    remark?: string;

    constructor(data: IGenerateLoadData) {
        this.roomNumber = data.roomNumber;
        this.currentMonthKW = data.currentMonthKW;
        this.previousMonthKW = data.previousMonthKW;
        this.hasUsageThisMonth = data.hasUsageThisMonth;
        this.usageDifference = data.usageDifference;
        this.usageAmount = data.usageAmount;
        this.extraAmountByRoom = data.extraAmountByRoom;
        this.totalAmount = data.totalAmount;
        this.isPaid = data.isPaid;
        this.paidAmount = data.paidAmount;
        this.remark = data.remark;
    }

    get totalAmountForDisplay() {
        return this.formatCurrency(this.totalAmount)
    }

    get extraAmountByRoomForDisplay() {
        return this.formatCurrency(this.extraAmountByRoom)
    }

    get paidAmountForDisplay() {
        return this.formatCurrency(this.paidAmount ?? 0)
    }

    get usageAmountForDisplay() {
        return this.formatCurrency(this.usageAmount)
    }

    get currentMonthKWForDisplay() {
        return this.formatKw(this.currentMonthKW)
    }
    get previousMonthKWForDisplay() {
        return this.formatKw(this.previousMonthKW)
    }
    get usageDifferenceForDisplay() {
        return this.formatKw(this.usageDifference)
    }

    private formatCurrency(value: number): string {
        return `${value.toLocaleString()} ៛`
    }

    private formatKw(value: number): string {
        return `${value.toLocaleString()} KW`
    }
}