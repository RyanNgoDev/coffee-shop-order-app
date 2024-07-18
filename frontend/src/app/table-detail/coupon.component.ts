import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Coupon } from "src/models/coupon.model";
import { RequestService } from "src/services/request.service";

@Component({
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styleUrls: ['./coupon.component.less']
})
export class CouponComponent implements OnInit {
    coupons: Coupon[] = [];
    
    constructor(public dialogRef: MatDialogRef<CouponComponent>,
        private readonly requestService: RequestService) { }
    
    ngOnInit(): void {
        this.requestService.getAllCoupons().then((coupons) => this.coupons = coupons);
    }

    selectCoupon(coupon: Coupon) {
        this.dialogRef.close(coupon);
    }
}