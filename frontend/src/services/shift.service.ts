import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { firstValueFrom } from "rxjs";
import { HttpRequestService } from "src/app/core/services/http-request.service";
import { OrderDetail } from "src/models/order-detail.model";
import { Order } from "src/models/order.model";
import { Shift } from "src/models/shift.model";
import { RequestService } from "./request.service";

@Injectable({
    providedIn: 'root',
  })
export class ShiftService {
    private readonly shiftKey = 'shifts';
    private readonly tableKey = 'temp_tables';
    private readonly shiftExpiredHours = 8;
    public shift: Shift | undefined = undefined;
    constructor(private readonly datePipe: DatePipe,
        private readonly httpRequestService: HttpRequestService,
        private readonly requestService: RequestService) {
    }

    async getShift() {
        return !_.isNil(this.shift) ? this.shift : await this.getCurrentShift();
    }

    // getCurrentShift() {
    //     const localShift = localStorage.getItem(this.shiftKey);
    //     if (localShift) {
    //         const shifts = JSON.parse(localShift) as Shift[];
    //         if (shifts.length > 0) {
    //             const lastest = shifts[shifts.length - 1];
    //             if (lastest.status === 'running') {
    //                 lastest.isActive = this.isShiftActive(lastest);
    //                 return lastest;
    //             }

    //             return null;
    //         }

    //         return null
    //     }

    //     return null;
    // }

    async getCurrentShift() {
        await this.requestService.getCurrentShift().then((shift) =>{
            if (shift) {
                if (shift.status === 'running') {
                    this.shift = shift;
                } else {
                    this.shift = undefined;
                }
            } else {
                this.shift = undefined;
            }
        });

        return this.shift;
    }

    async newShift() {
        localStorage.removeItem(this.tableKey);

        const shift =  {
            status: 'running',
            isActive: true,
        } as Shift;

        const result = await this.requestService.openShift(shift);
        this.shift = result as Shift;

        return this.shift;
    }

    async closeShift() {
        if (this.shift) { 
            this.shift.isActive = false;
            this.shift.status = 'closed';

            await this.requestService.closeShift(this.shift);
        }
    }

    calculateTotal(orders: Order[]) {
        if (this.shift) {
            this.shift.total = _.sumBy(orders, order => order.summary);
            this.shift.summary = _.sumBy(orders, (order) => order.summary);
        }
    }
}