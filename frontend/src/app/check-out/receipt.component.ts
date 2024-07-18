import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Order } from "src/models/order.model";
import { OrderService } from "src/services/order.service";

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.less']
})
export class ReceiptComponent implements OnInit {
    @Input() order: Order | undefined;
    constructor(
        private orderService: OrderService) { }

    ngOnInit() {
        
    }
}