import { OrderDetail } from "./order-detail.model";

export interface Order {
    receiptDetails: OrderDetail[];
    total: number;
    time: string;
    checkOutTime: string;
    orderId: string;
    printTime: string;
    printCount: number;
    table: string;
    coupon: string;
    summary: number;
    discount: number;
    isDiscountApplied: boolean;
    note: string;
    shiftId: number;
    discountAmount: number;
}