export interface IGenerateLoad {
    id?: string;
    date: string;                    // Report date (ISO string)
    homeId: number;                   // Home identifier
    totalUsage: number;               // Total kW used this month (sum of differences)
    data: IGenerateLoadData[];        // Per-room breakdown
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

export class GenerateLoad implements IGenerateLoadData {
    roomNumber: number;
    currentMonthKW: number;
    previousMonthKW: number;
    hasUsageThisMonth: boolean;
    usageDifference: number;
    usageAmount: number;
    extraAmountByRoom: number;
    totalAmount: number;

    constructor(data: IGenerateLoadData) {
        this.roomNumber = data.roomNumber;
        this.currentMonthKW = data.currentMonthKW;
        this.previousMonthKW = data.previousMonthKW;
        this.hasUsageThisMonth = data.hasUsageThisMonth;
        this.usageDifference = data.usageDifference;
        this.usageAmount = data.usageAmount;
        this.extraAmountByRoom = data.extraAmountByRoom;
        this.totalAmount = data.totalAmount;
    }
}