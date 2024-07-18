import { Order } from "./order.model";

export interface Table {
    id: number;
    name: string;
    info: string;
    order: Order;
    time: string;
}