import { DatePipe } from "@angular/common";
import { Injectable, OnInit } from "@angular/core";
import { GetOrdersRequest } from "src/models/get-orders-request.model";
import { Order } from "src/models/order.model";
import { RequestService } from "./request.service";

@Injectable({
    providedIn: 'root',
  })
export class OrderService {
    private readonly tempOrderStorageKey = 'order_';
    constructor(private readonly datePipe: DatePipe,
        private readonly requestService: RequestService) {
    }

    async generateOrderId(shiftId: number) { // get list order of the day, generate next iD, if empty, generate new 1st id MMDD001
        const order = await this.getLastestOrdersByShift(shiftId);
        if (order) {
            let id = Number(order.orderId);
            id += 1;
            return id.toString();
        }

        const today = new Date();
        const dayStr = this.datePipe.transform(today, 'MMdd');
        const orderId = dayStr + '001';
        return Number(orderId).toString();
    }

    async addOrder(order: Order) {
        order.printTime = await this.requestService.getCurrentTime();
        order.printCount = 1;
        this.requestService.addOrder(order);
    }

    async getOrdersByShift(shiftId: number) {
        return await this.requestService.getOrderByShift(shiftId);
    }

    async getLastestOrdersByShift(shiftId: number) {
        return await this.requestService.getLastestOrderByShift(shiftId);
    }

    async getOrdersByDate(request: GetOrdersRequest) {
        return await this.requestService.getOrderByDate(request);
    }
}